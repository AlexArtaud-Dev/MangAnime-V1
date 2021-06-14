const router = require('express').Router();
const {searchAnime, getAnimeInfos, getEpisodeInfos} = require("../functions/anime")
const browserObject = require('../functions/scrapper/browser');
const scraperController = require('../functions/scrapper/pageController');
const verify = require('./middlewares/verifyToken');

// Extend : https://www.npmjs.com/package/anime-scraper

/*
 security:
   - Bearer: []
*/

/**
 * @swagger
 * /anime/search/{name}:
 *   get:
 *      description: Use search animes corresponding to search query
 *      tags:
 *          - Anime
 *      parameters:
 *          - in: path
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '400':
 *           description: No name given
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.get('/search/:name',async (req, res) => {
    // if (!req.headers.authorization) return res.status(401).send("Unauthorized")
    if (!req.params.name) return res.status(400).send("No name given.")
    await searchAnime(req.params.name)
        .then(value => {
            res.status(200).send(value);
        }).catch(error => {
            res.status(500).send(error.message);
        })
})

/**
 * @swagger
 * /anime/{name}/{episode}:
 *   get:
 *      description: Use to get all information about an anime episode
 *      tags:
 *          - Anime
 *      parameters:
 *          - in: path
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *          - in: path
 *            name: episode
 *            schema:
 *              type: integer
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Couldn't find the episode or something is missing
 *         '415':
 *           description: Anime episode must be type of integer
 *         '500':
 *           description: Internal servor error
 */
router.get('/:name/:episode', async (req, res) => {
    if (!req.params.name) return res.status(400).send("Missing anime name.");
    if (!req.params.episode) return res.status(400).send("Missing anime episode.");
    if (isNaN(req.params.episode)) return res.status(415).send("Episode must be type of integer.");

    await getEpisodeInfos(req.params.name, parseInt(req.params.episode)).then(async episode => {
        if (!episode) {
            res.status(404).send("Episode not found.")
        } else {
            let browserInstance = browserObject.startBrowser();
            episode.videoLinks = await scraperController(browserInstance, episode.url);
            res.status(200).send(episode);
        }
    })


})

/**
 * @swagger
 * /anime/url:
 *   post:
 *      description: Use to get informations about an anime with his URL
 *      tags:
 *          - Anime
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
 *           description: Successfull Request
 *         '204':
 *           description: Successfull Request (nothing found)
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/:url',async (req, res) => {
    // if (!req.headers.authorization) return res.status(401).send("Unauthorized")
    if (!req.body.url) return res.status(400).send("No URL given.")
    await getAnimeInfos(req.body.url)
        .then(value => {
            if (!value){
                res.status(204).send(value);
            }else{
                res.status(200).send(value);
            }
        }).catch(error => {
            res.status(500).send(error.message);
        })
})


module.exports = router;