const puppeteer = require("puppeteer");

const fetchPage = async (req, loadContent, timeout) => {
  const { searchurl } = req.headers;
  const browser = await puppeteer.launch({
    args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
  });
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "font"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(searchurl, {
    waitUntil: loadContent,
    timeout: timeout || 0,
  });

  return {
    browser,
    page,
  };
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 1000;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

module.exports = { fetchPage, autoScroll };
