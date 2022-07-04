const classes = {
  picknPay: {
    classes: {
      PRODUCT_LIST: ".productCarouselItemContainer",
      ITEM_URL: ".js-potential-impression-click",
      IMAGE: ".thumb img",
      ITEM_NAME: ".item-name",
      SALE_PRICE: ".currentPrice",
      OLD_PRICE: ".item-price .oldPrice",
      PROMOTION_TEXT_SHORT: ".promotionContainer.promotionsShortText a span",
      PROMOTION_TEXT_LONG: ".promotionContainer.promotionsLongText a span",
    },
    urls: {
      regular:
        "https://www.pnp.co.za/pnpstorefront/pnp/en/All-Products/c/pnpbase?q=%3Arelevance%3AisOnPromotion%3AOn%2BPromotion%3Acategory%3A${category}-423144840&pageSize=100&text=",
      search:
        "https://www.pnp.co.za/pnpstorefront/pnp/en/search?q=SEARCH_QUERY%3Arelevance%3AisOnPromotion%3AOn%2BPromotion&text=SEARCH_QUERY&pageSize=100#",
    },
  },
  shoprite: {
    classes: {
      RESULTS: "p.total-number-of-results.pull-right",
      PRODUCT_LIST: "div.product-frame",
      ITEM_URL: "a.product-listening-click",
      IMAGE: "img",
      ITEM_DESCRIPTION: "h3.item-product__name a",
      SALE_PRICE: "div.special-price__price span.now",
    },
    urls: {
      regular:
        "https://www.shoprite.co.za/specials?q=%3AspecialsRelevance%3AregularSaveInSites%3A1894%3AregularSaveInSites%3APSWC%3AbrowseAllStoresFacet%3AbrowseAllStoresFacet%3AbrowseAllStoresFacetOff%3AbrowseAllStoresFacetOff%3AallCategories%3A${category}#",
      search:
        "https://www.shoprite.co.za/search?q=${searchQuery}%3AsearchRelevance%3AregularSaveInSites%3A1894%3AregularSaveInSites%3APSWC%3AbrowseAllStoresFacetOff%3AbrowseAllStoresFacetOff#",
    },
  },
  checkers: {
    classes: {
      RESULTS: ".cx-product-container",
      PRODUCT_LIST: "div.card",
      ITEM_URL: "a",
      IMAGE: "a img",
      ITEM_DESCRIPTION: "div.product-name",
      SALE_PRICE: "div.product-price.saving-color h2:first-child",
      LOAD_MORE_BTN: "div.btn.btn-block.align-btn.btn-primary",
    },
    urls: {
      regular:
        "https://www.checkersfs.co.za/cfsstore/en/ZAR/c/__category_placeholder?query=:relevance:allCategories:__category_placeholder:priceType:PROMOTIONAL",
      search:
        "https://www.checkersfs.co.za/cfsstore/en/ZAR/search/{__search_placeholder}:relevance:priceType:PROMOTIONAL",
    },
  },
  woolworths: {
    classes: {
      PRODUCT_LIST: ".product-list__item",
      ITEM_URL: ".product--view",
      IMAGE: ".product-card__img.lazyloaded",
      ITEM_DESCRIPTION: ".product-card__name",
      SALE_PRICE: ".product__price .price",
    },
    urls: {
      regular:
        "https://www.woolworths.co.za/cat/Food/__category_placeholder/_/__code_placeholder_Zxtznwk?No=0&Nrpp=400",
      search:
        "https://www.woolworths.co.za/cat/_/N-xtznwk?Ntt=__search_placeholder&No=0",
    },
  },
};

module.exports = classes;
