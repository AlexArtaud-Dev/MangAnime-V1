const router = require('express').Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const uuidAPIKey = require('uuid-apikey')
const { loginValidation, registerValidation } = require('../utils/validation');
const checkKey = require('../utils/axiosRequests/checkKey');
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   Auth  API  //////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                Register a new user in the database                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
 *              properties:
 *                 key:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
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
            if (data !== 200) return res.status(403).send({ error: "Bad Token" });

            const UUID = uuidAPIKey.toUUID(req.body.key);
            const key = await ApiKey.findOne({ UUID: UUID })

            if (!key) return res.status(500).send({ error: "Couldn't delete API Key after usage, contact the admin !" })

            // Data Validation
            const { error } = registerValidation(req.body);
            if (error) return res.status(400).send({ Error: error.details[0].message });

            // Checking if the user is already in the database
            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) return res.status(400).send({ message: "Email already exist !" })

            // Password Hashing
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Log In as a user to get Access Token                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
 *           description: Successfully Updated
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
    res.send(token);



})


module.exports = router;