const router = require('express').Router();
require('dotenv').config();
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');
const ApiKey = require('../models/ApiKey')
const User = require('../models/User')
const uuidAPIKey = require('uuid-apikey');


/**
 * @swagger
 * /key/generate:
 *   post:
 *      description: Use to generate an API register key
 *      tags:
 *          - Key
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfully Generated
 *         '400':
 *           description: User to update does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/generate', verify, verifyAdmin, async(req, res) => {
    const APIKEY = uuidAPIKey.create();
    const newKey = new ApiKey({ UUID: APIKEY.uuid, creatorID: req.user._id });
    await newKey.save();
    res.status(200).send({ APIKEY: APIKEY.apiKey });
})

/**
 * @swagger
 * /key/all:
 *   get:
 *      description: Use to get info of an API register key
 *      tags:
 *          - Key
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfully Found
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Nothing Found
 *         '500':
 *           description: Internal servor error
 */
router.get('/all',verify, verifyAdmin, async(req, res) => {
    const keys = await ApiKey.find({expirationDate : {$gt: Date.now()}})
    if (!keys || keys.length === 0) return res.status(404).send({message : "Nothing Found"})
    const keysArrays = [];
    for (let i=0; i < keys.length; i++) {
        const user = await User.findOne({_id: keys[i].creatorID})
        const modifiedKey = {
            _id: keys[i]._id,
            APIKEY: uuidAPIKey.toAPIKey(keys[i].UUID),
            UUID: keys[i].UUID,
            creationDate: keys[i].creationDate,
            expirationDate: keys[i].expirationDate,
            creatorID: keys[i].creatorID,
            creatorName: user.nickname
        };
        keysArrays.push(modifiedKey);
    }
    res.status(200).send(keysArrays)
})

/**
 * @swagger
 * /key/{key}:
 *   get:
 *      description: Use to get info of an API register key
 *      tags:
 *          - Key
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: key
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfully Updated
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: The key you entered does not exist or was deleted
 *         '422':
 *           description: Bad key format
 *         '500':
 *           description: Internal servor error (probably a conversion error)
 */
router.get('/:key', async(req, res) => {
    if (uuidAPIKey.isAPIKey(req.params.key) === false) return res.status(422).send({ error: "The format of the API KEY you wanted to check is incorrect" });
    const UUIDKEY = uuidAPIKey.toUUID(req.params.key);
    if (uuidAPIKey.isUUID(UUIDKEY) === false) return res.status(500).send({ error: "Internal Server Error (A problem happened during key conversion)" })
    const key = await ApiKey.findOne({ UUID: UUIDKEY });
    if (!key) return res.status(404).send({ message: "This key does not exist or was deleted" });
    res.status(200).send({ key: req.params.key, id: key._id, creationDate: key.creationDate, expirationDate: key.expirationDate })
})

/**
 * @swagger
 * /key/{key}:
 *   delete:
 *      description: Use to delete an API register key
 *      tags:
 *          - Key
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: key
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfully Updated
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: The key you entered does not exist or was deleted
 *         '422':
 *           description: Bad key format
 *         '500':
 *           description: Internal servor error (probably a conversion error)
 */
router.delete('/:key', verify, verifyAdmin, async(req, res) => {
    if (uuidAPIKey.isAPIKey(req.params.key) === false) return res.status(422).send({ error: "The format of the API KEY you wanted to check is incorrect" });
    const UUIDKEY = uuidAPIKey.toUUID(req.params.key);
    if (uuidAPIKey.isUUID(UUIDKEY) === false) return res.status(500).send({ error: "Internal Server Error (A problem happened during key conversion)" })
    const key = await ApiKey.findOne({ UUID: UUIDKEY });
    if (!key) return res.status(404).send({ message: "This key does not exist or was already deleted" });
    key.delete();
    res.status(200).send({ message: "Key deleted sucessfully" })
})



module.exports = router;