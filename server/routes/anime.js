const router = require('express').Router();
const {searchAnime, getAnimeInfos, getAnimeByName, getEpisodeInfos, upAnime, deleteAnimeFromDB} = require("../functions/anime")
const browserObject = require('../functions/scrapper/browser');
const scraperController = require('../functions/scrapper/pageController');
const malScraper = require('mal-scraper')
const User = require('../models/User');
const SearchCache = require("../models/SearchCache");
const AnimeInfos = require("../models/AnimeInfos");
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');
const mongoose = require("mongoose");
const Anime = require("anime-scraper").Anime;



/**
 * @swagger
 * /anime/search/{name}:
 *   get:
 *      description: Use search animes corresponding to search query
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
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
router.get('/search/:name', verify, async (req, res) => {
    if (!req.params.name) return res.status(400).send("No name given.")
    const cache = await SearchCache.findOne({name: req.params.name.toLowerCase()});
    if (cache){
        let arrayCache = cache.result;
        arrayCache.sort(function(a, b){
            let firstLetterOne = a.name[0].toLowerCase();
            let firstLetterTwo = b.name[0].toLowerCase();
            if (firstLetterOne < firstLetterTwo) return -1;
            if (firstLetterOne > firstLetterTwo) return 1;
            return 0;
        })
        res.status(200).send(arrayCache);
    }else{
        await searchAnime(req.params.name)
            .then(async value => {
                const animeSearchArray = [];
                for (const anime of value) {
                    const pictures = await malScraper.getPictures(anime.name);
                    const newAnime = {
                        id: anime.id,
                        name: anime.name,
                        url: anime.url,
                        date: anime.date,
                        episodesNumber: anime.episodesNumber,
                        picture: pictures[pictures.length-1]
                    }
                    animeSearchArray.push(newAnime);
                }
                if (animeSearchArray.length !== 0){
                    animeSearchArray.sort(function(a, b){
                        let firstLetterOne = a.name[0].toLowerCase();
                        let firstLetterTwo = b.name[0].toLowerCase();
                        if (firstLetterOne < firstLetterTwo) return -1;
                        if (firstLetterOne > firstLetterTwo) return 1;
                        return 0;
                    })
                    const toCache = new SearchCache({
                        name: req.params.name.toLowerCase(),
                        result: animeSearchArray
                    })
                    await toCache.save();
                }
                res.status(200).send(animeSearchArray);
            }).catch(error => {
                console.log("Erreur : " + error)
                res.status(500).send(error.message);
            })
    }
})

/**
 * @swagger
 * /anime/popular/{limit}:
 *   get:
 *      description: Use to get popular anime on MangAnime
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: limit
 *            schema:
 *              type: string
 *              required: true
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '400':
 *           description: Missing limit parameter
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Nothing Found
 *         '500':
 *           description: Internal servor error
 */
router.get('/popular/:limit', verify, async (req, res) => {
    if (!req.params.limit) return res.status(400).send("Missing limit parameter")
    const topAnimes = await AnimeInfos.find().sort({fame: -1}).limit(parseInt(req.params.limit))
    if (!topAnimes) return res.status(404).send("No Anime found from popular anime list")
    const topAnimesArray = [];
    topAnimes.forEach(anime => {
        const object = {
            name: anime.name,
            url: anime.url,
            image: anime.image,
            fame: anime.fame
        }
        topAnimesArray.push(object);
    })
    topAnimesArray.sort(function(a, b){
        let firstLetterOne = a.name[0].toLowerCase();
        let firstLetterTwo = b.name[0].toLowerCase();
        if (firstLetterOne < firstLetterTwo) return -1;
        if (firstLetterOne > firstLetterTwo) return 1;
        return 0;
    })
    res.status(200).send(topAnimesArray)
})

/**
 * @swagger
 * /anime/watched:
 *   get:
 *      description: Use to get user watched animes
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '400':
 *           description: Account not found
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Nothing Found
 *         '500':
 *           description: Internal servor error
 */
router.get('/watched', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user._id});
    if (!user) return res.status(400).send("No account corresponding to this token in the database");
    if (user.watchedAnimes.length === 0) return res.status(404).send("Nothing Found");
    user.watchedAnimes.sort(function(a, b){
        let firstLetterOne = a.name[0].toLowerCase();
        let firstLetterTwo = b.name[0].toLowerCase();
        if (firstLetterOne < firstLetterTwo) return -1;
        if (firstLetterOne > firstLetterTwo) return 1;
        return 0;
    })
    res.status(200).send(user.watchedAnimes);
})

/**
 * @swagger
 * /anime/{name}:
 *   get:
 *      description: Use to get all information about an anime
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Couldn't find the episode or something is missing
 *         '500':
 *           description: Internal servor error
 */
router.get('/:name', verify, async (req, res) => {
    if (!req.params.name) return res.status(400).send("Missing anime name.");
    await getAnimeByName(req.params.name).then(async anime => {
        if (!anime) {
            res.status(404).send("Anime not found.")
        } else {
            await getAnimeInfos(anime.url)
                .then(async value => {
                    if (!value) {
                        res.status(204).send(value);
                    } else {
                        const infos = await malScraper.getInfoFromName(value.name);
                        const url = await Anime.search(value.name);
                        const animeInfos = {
                            id : value.id,
                            name: value.name,
                            url : url[0].url,
                            score: infos.score,
                            releaseDate: value.releaseDate,
                            status: infos.status,
                            synopsis: infos.synopsis,
                            genres: value.genres,
                            picture: infos.picture,
                            trailer: infos.trailer,
                            episodesNumber: value.numberEpisode,
                            episodeDuration: infos.duration,
                            characters : infos.characters,
                            staff: infos.staff,
                            diffusionType: infos.type,
                            broadcastTime: infos.broadcast,
                            producers: infos.producers,
                            studios: infos.studios,
                        }
                        const user = await User.findOne({_id : mongoose.Types.ObjectId(req.user._id)})
                        let alreadyExist = false;
                        user.watchedAnimes.forEach(anime =>{
                            if (anime.id === value.id && anime.name === value.name){
                                alreadyExist = true;
                            }
                        })
                        if (!alreadyExist) {
                            user.watchedAnimes.push({
                                id: value.id,
                                name: value.name,
                                url: url[0].url,
                                picture: infos.picture,
                                watchedEpisodes: []
                            })
                            await user.save();
                        }
                        res.status(200).send(animeInfos);
                    }
                }).catch(error => {
                    res.status(500).send(error.message);
                })
        }
    })
})

/**
 * @swagger
 * /anime/{name}/{episode}:
 *   get:
 *      description: Use to get all information about an anime episode
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
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
router.get('/:name/:episode', verify, async (req, res) => {
    if (!req.params.name) return res.status(400).send("Missing anime name.");
    if (!req.params.episode) return res.status(400).send("Missing anime episode.");
    if (isNaN(req.params.episode)) return res.status(415).send("Episode must be type of integer.");
    if (req.params.episode <= 0) return res.status(415).send("Episode must be superior to 0.");
    try{
        await getEpisodeInfos(req.params.name, parseInt(req.params.episode)-1).then(async episode => {
            if (!episode) {
                res.status(404).send("Episode not found.")
            } else {
                let browserInstance = browserObject.startBrowser();
                episode.videoLinks = await scraperController(browserInstance, episode.url);
                const user = await User.findOne({_id: mongoose.Types.ObjectId(req.user._id)})
                let anime, index;
                for (let i = 0; i < user.watchedAnimes.length; i++) {
                    if (user.watchedAnimes[i].name === req.params.name){
                        anime = user.watchedAnimes[i];
                        index = i;
                    }
                }
                if (anime){
                    let newArray = [];
                    Array.prototype.push.apply(newArray, user.watchedAnimes[index].watchedEpisodes);
                    newArray.push(parseInt(req.params.episode))
                    newArray.sort((a, b) => a - b);
                    const newEpisode = {
                        id : user.watchedAnimes[index].id,
                        name: user.watchedAnimes[index].name,
                        url : user.watchedAnimes[index].url,
                        picture: user.watchedAnimes[index].picture,
                        watchedEpisodes: newArray
                    }
                    user.watchedAnimes.pull(user.watchedAnimes[index]);
                    user.watchedAnimes.push(newEpisode);


                    user.save();
                }
                res.status(200).send(episode);
            }
        })
    }catch (error){
        if (error.message === "Cannot read property 'fetch' of undefined"){
            res.status(500).send("Could not find the anime episode you were searching for.");
        }else{
            res.status(500).send(error.message);
        }

    }

})

/**
 * @swagger
 * /anime/url:
 *   post:
 *      description: Use to get informations about an anime with his URL
 *      tags:
 *          - Anime
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
 *           description: Successfull Request
 *         '204':
 *           description: Successfull Request (nothing found)
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/:url', verify, async (req, res) => {
    if (!req.body.url) return res.status(400).send("No URL given.")
    await getAnimeInfos(req.body.url)
        .then(async value => {
            if (!value) {
                res.status(204).send(value);
            } else {
                const infos = await malScraper.getInfoFromName(value.name);
                const animeInfos = {
                    id : value.id,
                    name: value.name,
                    score: infos.score,
                    releaseDate: value.releaseDate,
                    status: infos.status,
                    synopsis: infos.synopsis,
                    genres: value.genres,
                    picture: infos.picture,
                    trailer: infos.trailer,
                    episodesNumber: value.numberEpisode,
                    episodeDuration: infos.duration,
                    characters : infos.characters,
                    staff: infos.staff,
                    diffusionType: infos.type,
                    broadcastTime: infos.broadcast,
                    producers: infos.producers,
                    studios: infos.studios,
                }
                res.status(200).send(animeInfos);
            }
        }).catch(error => {
            res.status(500).send(error.message);
        })
})

/**
 * @swagger
 * /anime/up:
 *   patch:
 *      description: Use to increment the fame of an anime
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: body
 *            name: Anime
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *                 - url
 *              properties:
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '202':
 *           description: Successfull Request but won't apply
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.patch('/up', verify, async (req, res) => {
    await upAnime(req.body.name, req.body.url, req.user._id)
        .then(data => {
            if (data.message === "Success of creating and upvoting the anime"){
                res.status(200).send(data.message)
            }else{
                res.status(202).send(data.message)
            }
        })
        .catch(error => {
            res.status(500).send(error)
    })
})

/**
 * @swagger
 * /anime/remove:
 *   delete:
 *      description: Use to delete an anime from database
 *      tags:
 *          - Anime
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: body
 *            name: Anime
 *            schema:
 *              type: object
 *              required:
 *                 - name
 *              properties:
 *                 name:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.delete('/remove', verify, verifyAdmin, async (req, res) => {
    await deleteAnimeFromDB(req.body.name)
        .then(data => {
            res.status(200).send(data.message)
        })
        .catch(error => {
            res.status(500).send(error)
        })
})

module.exports = router;