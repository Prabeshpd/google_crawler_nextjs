import puppeteer from 'puppeteer';

export async function convertHtmlToPdf(htmlString: string) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [`--no-sandbox`, `--disable-setuid-sandbox`],
  });
  const page = await browser.newPage();
  await page.setContent(htmlString, { waitUntil: 'domcontentloaded' });
  const pdf = await page.pdf();
  browser.close();

  return pdf;
}
