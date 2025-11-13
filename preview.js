const path = require("path");
const url = require("url");
const fs = require("fs");
const puppeteer = require("puppeteer");

async function main() {
  const filePath = path.resolve(__dirname, "index.html");
  if (!fs.existsSync(filePath)) {
    throw new Error("index.html not found");
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
  });

  try {
    const page = await browser.newPage();
    await page.goto(url.pathToFileURL(filePath).href, {
      waitUntil: "networkidle0",
    });
    const screenshotPath = path.resolve(__dirname, "preview.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Preview saved to ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
