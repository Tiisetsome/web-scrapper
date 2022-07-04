const express = require("express");
const asyncHandler = require("express-async-handler");

const { fetchPage } = require("../../utils/actions");
const { picknPay } = require("../../utils/constants");
const { classes } = picknPay;

const router = express.Router();

// @desc     Scrape promotional items from pick' n pay website
// @route    GET /api/v1/picknPay/
// @access   Public

const setURLHeader = (req) => {
  const { category, search } = req.query;

  let url;

  if (search) {
    url = picknPay.urls.search;

    req.headers.searchurl = url.replace(/SEARCH_QUERY/g, search);
  } else {
    url = picknPay.urls.regular;

    req.headers.searchurl = url.replace("${category}", category);
  }
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search } = req.query;

    if (!category) {
      res.status(404);
      throw new Error("Category is not specified!");
    }

    setURLHeader(req);

    const { page, browser } = await fetchPage(req, "load");

    const productsOnSale = await page.evaluate((classes) => {
      const productsList = document.querySelectorAll(classes.PRODUCT_LIST);

      let products = [];

      productsList.forEach((product) => {
        const itemUrl = product
          .querySelector(classes.ITEM_URL)
          .getAttribute("href");

        const image = product.querySelector(classes.IMAGE).getAttribute("src");

        const itemDescription = product.querySelector(
          classes.ITEM_NAME
        ).innerHTML;

        let salePrice = product
          .querySelector(classes.SALE_PRICE)
          .textContent.trim();

        let originalPrice = 0;

        const promotionText =
          product.querySelector(classes.PROMOTION_TEXT_SHORT) ||
          product.querySelector(classes.PROMOTION_TEXT_LONG);

        if (promotionText) {
          originalPrice = salePrice.slice(0, salePrice.length - 2);
          salePrice = promotionText.textContent;
        } else {
          let price = product.querySelector(classes.OLD_PRICE).textContent;
          originalPrice = price.slice(0, price.length - 2);
          salePrice = salePrice.slice(0, salePrice.length - 2);
        }

        products.push({
          itemUrl: `https://www.pnp.co.za/pnpstorefront${itemUrl}`,
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
