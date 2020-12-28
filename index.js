const puppeteer = require('puppeteer')
const fs = require('fs');
const { normalize } = require('path');

const url = 'https://buy.mi.co.id/id/registration';
const imei = fs.readFileSync(normalize('imei.txt'), { encoding: 'utf-8' }).split('\n').map(d => d.replace('\r', ''));

const searchCountry = async () => {
    const browser = await puppeteer.launch({ headless: true });

    for (const imeiItem of imei) {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[name=imei]');
        await page.type('input[name=imei]', imeiItem)
        await page.click('body > div.section.section-picker > div.picker-imei > form > input')
        const element = await page.waitForSelector('body > div.section.section-pass > div.phone-info > p:nth-child(2) > span:nth-child(2)')
        const country = await page.evaluate(el => el.textContent, element)
        await page.close()

        console.log(imeiItem, country)
    }

    await browser.close()
}

searchCountry()