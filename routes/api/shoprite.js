const express = require("express");
const asyncHandler = require("express-async-handler");
const cherio = require("cheerio");
const axios = require("axios");
const router = express.Router();

const { shoprite } = require("../../utils/constants");
const { classes } = shoprite;

// @desc     Scrape promotional items from shoprite website
// @route    GET /api/v1/shoprite/
// @access   Public

const getNumberOfPages = ($) => {
  const searchResults = +$(classes.RESULTS).text().trim().split(" ")[0];
  const numberOfPages = Math.round(searchResults / 20);

  return numberOfPages;
};

const setURLHeader = (req) => {
  let { category, search } = req.query;

  let url;
  if (search) {
    url = shoprite.urls.search;

    req.headers.searchurl = url.replace("${searchQuery}", search);
  } else {
    url = shoprite.urls.regular;

    req.headers.searchurl = url.replace("${category}", category);
  }
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, category } = req.query;
    if (!category) {
      res.status(404);
      throw new Error("Category is not specified");
    }

    if (process.env.NODE_ENV === "development") {
      // NB : Dangerous, please look for a solution, not a hack
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }

    setURLHeader(req);

    const { searchurl } = req.headers;

    const { data: html } = await axios.get(searchurl);

    const $ = cherio.load(html);

    const numberOfPages = getNumberOfPages($);

    const productsOnSale = [];

    if (html) {
      for (let i = 0; i < numberOfPages; i++) {
        const { data: page } = await axios.get(
          i > 0 ? searchurl : searchurl.replace(/#/g, `&page=${i}`)
        );

        const $ = cherio.load(page);

        $(classes.PRODUCT_LIST, page).each((i, el) => {
          const itemUrl = $(el).find(classes.ITEM_URL).attr("href");

          const image = $(el).find(classes.IMAGE).attr("data-original-src");

          const itemDescription = $(el)
            .find(classes.ITEM_DESCRIPTION)
            .text()
            .trim();

          const salePrice = $(el).find(classes.SALE_PRICE).text();

          const originalPrice = null;

          productsOnSale.push({
            itemUrl: `https://www.shoprite.co.za${itemUrl}`,
            image: `https://www.shoprite.co.za${image}`,
            itemDescription,
            salePrice,
            originalPrice,
          });
        });
      }
      return res.status(200).json({
        data: productsOnSale,
        results: productsOnSale.length,
      });
    }

    res.status(404).json({
      message: "Something went wrong",
    });
    throw new Error("The page is not found");
  })
);

module.exports = router;
