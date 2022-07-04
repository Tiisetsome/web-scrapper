const express = require("express");
const asyncHandler = require("express-async-handler");
const { woolworths } = require("../../utils/constants");
const { classes } = woolworths;

const { fetchPage, autoScroll } = require("../../utils/actions");

const router = express.Router();

// @desc     Scrape promotional items from woolworths website
// @route    GET /api/v1/woolworths/
// @access   Public

const setURLHeader = (req) => {
  const { category, code, search } = req.query;

  if (search) {
    url = woolworths.urls.search;
    url = url.replace(/__search_placeholder/g, search);
    req.headers.searchurl = url;
  } else {
    url = woolworths.urls.regular;
    url = url.replace(/__category_placeholder/g, category);
    url = url.replace(/__code_placeholder_/g, code);

    req.headers.searchurl = url;
  }
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, code, search } = req.query;

    // NB: Woolworths is different from other endpoints
    // It requires both the url-code and category
    if (!(category && code)) {
      res.status(404);
      throw new Error("Category is not spcecified");
    }

    setURLHeader(req);

    const { page, browser } = await fetchPage(req, "load");

    await page.waitForSelector(classes.PRODUCT_LIST, { timeout: 1500 });

    await autoScroll(page);

    const productsOnSale = await page.evaluate((classes) => {
      const productsList = document.querySelectorAll(classes.PRODUCT_LIST);

      const products = [];

      productsList.forEach((product) => {
        const itemUrl = product
          .querySelector(classes.ITEM_URL)
          .getAttribute("href");

        const image = product.querySelector(classes.IMAGE).getAttribute("src");

        const itemDescription = product.querySelector(
          classes.ITEM_DESCRIPTION
        ).textContent;

        const salePrice = product.querySelector(classes.SALE_PRICE).textContent;

        const originalPrice = null;

        products.push({
          itemUrl,
          image,
          itemDescription,
          salePrice,
          originalPrice,
        });
      });

      return products;
    }, classes);

    await browser.close();

    res.status(200).json({
      data: productsOnSale,
      results: productsOnSale.length,
    });
  })
);

module.exports = router;
