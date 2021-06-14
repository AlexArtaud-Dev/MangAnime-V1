const router = require('express').Router();
const mongoose = require('mongoose');
require('dotenv').config();
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');
const ApiKey = require('../models/ApiKey')
const uuidAPIKey = require('uuid-apikey');
const verifyAdminToken = require('./middlewares/verifyAdminToken');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   API KEY    //////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                      Generate REGISTER API KEY                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    const newKey = new ApiKey({ UUID: APIKEY.uuid });
    await newKey.save();
    res.status(200).send({ APIKEY: APIKEY.apiKey });
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                      GET INFO REGISTER API KEY                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
router.get('/:key', verify, verifyAdmin, async(req, res) => {
    if (uuidAPIKey.isAPIKey(req.params.key) === false) return res.status(422).send({ error: "The format of the API KEY you wanted to check is incorrect" });
    const UUIDKEY = uuidAPIKey.toUUID(req.params.key);
    if (uuidAPIKey.isUUID(UUIDKEY) === false) return res.status(500).send({ error: "Internal Server Error (A problem happened during key conversion)" })
    const key = await ApiKey.findOne({ UUID: UUIDKEY });
    if (!key) return res.status(404).send({ message: "This key does not exist or was deleted" });
    res.status(200).send({ key: req.params.key, id: key._id, creationDate: key.creationDate, expirationDate: key.expirationDate })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       DELETE REGISTER API KEY                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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