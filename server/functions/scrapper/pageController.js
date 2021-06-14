const pageScraper = require('./pageScrapper');

async function scrapeAll(browserInstance, url){
    let browser;
    try{
        browser = await browserInstance;
        return await pageScraper.scraper(browser, url);
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance, url) => {
    return scrapeAll(browserInstance, url)
}