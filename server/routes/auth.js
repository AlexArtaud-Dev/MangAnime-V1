const router = require('express').Router();
const mongoose = require("mongoose")
require('dotenv').config();
const qrcode = require("qrcode-generator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const uuidAPIKey = require('uuid-apikey')
const verify = require('./middlewares/verifyToken');
const { loginValidation, registerValidation } = require('../utils/validation');
const checkKey = require('../utils/axiosRequests/checkKey');

/**
 * @swagger
 * /user/register:
 *   post:
 *      description: Use to create an account
 *      tags:
 *          - Auth
 *      parameters:
 *          - in: body
 *            name: Account
 *            schema:
 *              type: object
 *              required:
 *                 - key
 *                 - nickname
 *                 - email
 *                 - password
 *                 - passwordConfirmation
 *              properties:
 *                 key:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 passwordConfirmation:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Successfully Updated
 *         '400':
 *           description: User to update does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/register', async(req, res) => {
    checkKey(req.body.key)
        .then(async(data) => {
            if (data !== 200) return res.status(403).send({ error: "Wrong Invitation Key." });

            const UUID = uuidAPIKey.toUUID(req.body.key);
            const key = await ApiKey.findOne({ UUID: UUID })

            if (!key) return res.status(500).send({ error: "Couldn't delete API Key after usage, contact the admin !" })
            const keyOwner = await User.findOne({_id: mongoose.Types.ObjectId(key.creatorID)})
            if (!keyOwner) {
                key.delete();
                return res.status(403).send({error: "User that generated the key does not exist anymore, so the key is invalid. Try again with another key."});
            }
            if (parseInt(keyOwner.authority.level) !== 10) {
                key.delete();
                return res.status(403).send({ error: "User that generated the key is not allowed to do it anymore, so the key is invalid. Try again with another key." })
            }
            // Data Validation
            const { error } = registerValidation(req.body);
            if (error) return res.status(400).send({ Error: error.details[0].message });

            // Checking if the user is already in the database
            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) return res.status(400).send({ message: "Email already exist !" })

            // Password Hashing
            if (!req.body.passwordConfirmation) return res.status(400).send({ message: "Missing password confirmation" })
            if (req.body.password !== req.body.passwordConfirmation) return res.status(400).send({ message: "The two password does not match" })
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            // Create a new User
            const user = new User({
                nickname: req.body.nickname,
                email: req.body.email,
                password: hashPassword
            });
            try {
                const savedUser = await user.save();
                res.status(200).send({ user: user._id });
            } catch (error) {
                res.status(400).send({ message: error.message })
            }
            key.delete();
        })

});


/**
 * @swagger
 * /user/login:
 *   post:
 *      description: Use to login to an account
 *      tags:
 *          - Auth
 *      parameters:
 *          - in: body
 *            name: Account
 *            schema:
 *              type: object
 *              required:
 *                 - email
 *                 - password
 *              properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Successfully Connected
 *         '400':
 *           description: Email or password does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.post('/login', async(req, res) => {
    // Data Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send({ Error: error.details[0].message });

    // Checking if the email is already in the database
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ message: "Email doesn't exist !" });

    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ error: "Invalid Password" });

    // Create and assign a token

    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
    res.status(200).send(token);
})

/**
 * @swagger
 * /user/checkToken:
 *   post:
 *      description: Use to check if a token is valid
 *      tags:
 *          - Auth
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Token is valid
 *         '400':
 *           description: Token is not valid
 *         '401':
 *           description: No Token provided
 *         '500':
 *           description: Internal servor error
 */
router.post('/checkToken', async(req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({ message: "No Token provided" });
    try{
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        if (user) return res.status(200).send({status: true});
    }catch (e) {
        return res.status(400).send({status: false});
    }



})

/**
 * @swagger
 * /user/generate/qr:
 *   get:
 *      description: Allow connection using only token (with QR Code)
 *      tags:
 *          - Auth
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfully Generated
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.get('/generate/qr', verify, async(req, res) => {
    if (!req.header("auth-token")) return res.status(400).send("You need to pass an auth-token to generate a QR Code");

    const typeNumber = 0;
    const errorCorrectionLevel = 'H';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(`https://localhost:3000/qr/login/${req.header("auth-token")}`);
    qr.make();
    const QRCodeBase64 = qr.createImgTag();
    res.status(200).send(QRCodeBase64.split("\"")[1]);
})

/**
 * @swagger
 * /user/login/qr:
 *   post:
 *      description: Allow connection using only token (with QR Code)
 *      tags:
 *          - Auth
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfully Connected
 *         '400':
 *           description: You need to pass an auth-token to login
 *         '404':
 *           description: The token is not correct
 *         '500':
 *           description: Internal servor error
 */
router.post('/login/qr', async(req, res) => {
    if (!req.header("auth-token")) return res.status(400).send("You need to pass an auth-token to login");
    const user = jwt.verify(req.header("auth-token"), process.env.TOKEN_SECRET);
    if (!user) return res.status(500).send("A problem occured while decoding the token")
    const dbUser = await User.findOne({ _id: user._id});
    if (!dbUser) return res.status(404).send("Not user associated to this token found")

    const token = jwt.sign({ _id: dbUser._id }, process.env.TOKEN_SECRET);
    res.status(200).send(token);
})

module.exports = router;