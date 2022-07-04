const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

const { fetchPage } = require("../../utils/actions");
const { checkers } = require("../../utils/constants");

const { classes } = checkers;

const loadAllProductsOnPage = async (page, numberOfButtonClicks) => {
  for (let i = 1; i < numberOfButtonClicks; i++) {
    await page.waitForSelector(classes.LOAD_MORE_BTN, {
      timeout: 1500,
    });

    await page.evaluate(async (BUTTON_CLASS) => {
      let button = document.querySelector(BUTTON_CLASS);

      if (button) {
        button.click();
      }
    }, classes.LOAD_MORE_BTN);
  }
};

const setURLHeader = (req) => {
  let { category, search } = req.query;

  let url;
  if (search) {
    url = checkers.urls.search;

    req.headers.searchurl = url.replace(
      "{__search_placeholder}",
      `${search}?query=${search}`
    );
  } else {
    url = checkers.urls.regular;

    req.headers.searchurl = url.replace(
      /__category_placeholder/g,
      req.query.category
    );
  }
};

// @desc     Scrape promotional items from checkers website
// @route    GET /api/v1/checkers/
// @access   Public

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search } = req.query;
    if (!req.query.category) {
      res.status(404);
      throw new Error("Category is not specified");
    }

    setURLHeader(req);

    const { page, browser } = await fetchPage(req, "load");

    await page.waitForSelector(classes.RESULTS, { timeout: 3000 });

    const searchResults = await page.evaluate(() => {
      return document.querySelector("title").innerHTML;
    });

    const numberOfItemsOnSale = +searchResults.trim().split(" ")[0];

    const numberOfButtonClicks = Math.ceil(numberOfItemsOnSale / 12);

    await loadAllProductsOnPage(page, numberOfButtonClicks);

    setTimeout(async () => {
      await page.waitForSelector(classes.PRODUCT_LIST, { timeout: 1500 });

      const productsOnSale = await page.evaluate((classes) => {
        const productsList = document.querySelectorAll(classes.PRODUCT_LIST);

        let products = [];

        productsList.forEach((product) => {
          const itemUrl = product
            .querySelector(classes.ITEM_URL)
            .getAttribute("href");

          const image = product
            .querySelector(classes.IMAGE)
            .getAttribute("src");

          const itemDescription = product.querySelector(
            classes.ITEM_DESCRIPTION
          ).textContent;

          const salePrice = product
            .querySelector(classes.SALE_PRICE)
            .textContent.trim();

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

      return res.status(200).json({
        data: productsOnSale,
        results: productsOnSale.length,
      });
    }, 500);
  })
);

module.exports = router;
