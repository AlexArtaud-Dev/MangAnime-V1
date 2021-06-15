const router = require('express').Router();
const browserObject = require('../functions/scrapper/browser');
const scraperController = require('../functions/scrapper/pageController');
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');


/**
 * @swagger
 * /scrapper/run:
 *   post:
 *      description: Start scrapper script
 *      tags:
 *          - Scrapper
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: body
 *            name: URL
 *            schema:
 *              type: object
 *              required:
 *                 - url
 *              properties:
 *                 url:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Started SuccessFully
 *         '400':
 *           description: Something is missing
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/run', verify, verifyAdmin, async (req, res) => {
    if (!req.body.url) return res.status(400).send("URL is missing.")
    let browserInstance = browserObject.startBrowser();
    await scraperController(browserInstance, req.body.url)
    res.status(200).send("Scrapped SuccessFully");
})




module.exports = router;