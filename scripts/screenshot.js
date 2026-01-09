import { chromium } from "playwright";
import sharp from "sharp";

const TARGET_URL =
  "https://solar-carport.meiwajp-dev.link/meiwa-niigata-factory";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: null });

  await page.goto(TARGET_URL, { waitUntil: "networkidle" });

  const size = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      width: Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      ),
      height: Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
    };
  });

  await page.setViewportSize(size);

  await page.screenshot({
    path: "public/_raw.png",
    fullPage: true
  });

  await browser.close();

  await sharp("public/_raw.png")
    .resize(1920, 1080, {
      fit: "contain",
      background: "#000"
    })
    .png()
    .toFile("public/latest.png");
})();

