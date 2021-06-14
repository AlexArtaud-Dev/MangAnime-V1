const scraperObject = {
    url: '',
    async scraper(browser, url){
        this.url = url;
        let page = await browser.newPage();
        // console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, {waitUntil: "networkidle2"});


        let servers = await page.$$eval('.anime_muti_link ul > li', classes => {
            classes = classes.map(el => el.getAttribute("class"))
            return classes;
        })
        let urls = await page.$$eval('.anime_muti_link ul > li', links => {
            links = links.map(el => el.querySelector('a').getAttribute("data-video"))
            return links;
        })

        if (servers.length !== urls.length) throw new Error("An error happened during scrapping.");
        const videoURL = [];
        for (let i = 0; i < servers.length; i++){
            videoURL.push({server: servers[i], url: urls[i]})
        }

        let downloadPageURL = await page.$$eval('.dowloads', downloadURL => {
            downloadURL = downloadURL.map(el => el.querySelector('a').href)
            return downloadURL;
        })

        await page.goto(downloadPageURL.toString(), {waitUntil: "networkidle2"});
        let downloadMirrorURL = await page.$$eval('.mirror_link > .dowload', downloadURL => {
            downloadURL = downloadURL.map(el => el.querySelector('a').href)
            return downloadURL;
        })
        browser.close();
        return {
            streamingLinks: videoURL,
            downloadLinks: downloadMirrorURL
        }

    }
}

module.exports = scraperObject;