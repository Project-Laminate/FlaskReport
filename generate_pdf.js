// generate_pdf.js
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5000/', { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'output.pdf', format: 'A4' });
    await browser.close();
})();
