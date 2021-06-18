const router = require('express').Router();
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey')
const { userUpdateValidation } = require('../utils/validation');


/**
 * @swagger
 * /users/:
 *   get:
 *      description: Use to get user informations from auth-token
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '400':
 *           description: User does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.get('/', verify, async(req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(400).send({ message: "User does not exist" });
    res.status(200).send(user);
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *      description: Use to get user informations from id
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '400':
 *           description: User does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.get('/:id', verify, async(req, res) => {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) return res.status(400).send({ message: "User does not exist" });
    res.status(200).send({
        _id: user._id,
        nickname: user.nickname,
        authority: {
            level: user.authority.level
        }
    });
})

/**
 * @swagger
 * /users/elevateToAdmin/{id}:
 *   patch:
 *      description: Use to set a user to admin permission level
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *      responses:
 *         '200':
 *           description: Successfully Elevated
 *         '400':
 *           description: Token does not exist or you don't have the authority to make this change | the user you tried to elevate is already admin
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.patch('/elevateToAdmin/:id', verify, async(req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(400).send({ message: "The Token you used does not belong to an user" });
    if (user.authority.level !== 10) return res.status(400).send({ message: "You don't have the authority to do that!" });
    const userToElevate = await User.findOne({ _id: req.params.id });
    if (!userToElevate) return res.status(400).send({ message: "The user you tried to elevate does not exist" });
    if (userToElevate.authority.level === 10 && userToElevate.authority.adminToken !== "null") return res.status(400).send({ message: "The user already has admin authority" });
    const salt = await bcrypt.genSalt(10);
    const hashAdminToken = await bcrypt.hash(process.env.ADMIN_TOKEN, salt);
    userToElevate.authority.level = 10;
    userToElevate.authority.adminToken = hashAdminToken;
    userToElevate.save();
    res.status(200).send({ message: "Elevated" });
})

/**
 * @swagger
 * /users/:
 *   patch:
 *      description: Use to update your account with your auth-token
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: body
 *            name: User
 *            schema:
 *              type: object
 *              required:
 *                 - nickname
 *                 - email
 *                 - password
 *              properties:
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
router.patch('/', verify, async(req, res) => {
    const userToUpdate = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) })
    if (!userToUpdate) return res.status(400).send({ message: "User to update does not exist" })
        // Check body parameters existence
    if (!req.body.nickname) { req.body.nickname = userToUpdate.nickname }
    if (!req.body.email) { req.body.email = userToUpdate.email }
    if (!req.body.password) {
        req.body.password = userToUpdate.password
    } else {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }


    // Data Validation
    const { error } = userUpdateValidation(req.body);
    if (error) return res.status(400).send({ Error: error.details[0].message });


    const updated = await userToUpdate.updateOne({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    });

    if (!userToUpdate) return res.status(400).send({ message: "This user does not exist or has been deleted !" })
    const userUpdated = await User.findOne({ _id: req.user._id })
    res.status(200).send({ message: "User Updated", updatedUser: userUpdated });
})

/**
 * @swagger
 * /users/:
 *   delete:
 *      description: Use to delete your account
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
     *           description: Successfully Deleted
 *         '400':
 *           description: Token does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.delete('/', verify, async(req, res) => {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) })
    if (!user) return res.status(400).send({ message: "The Token you used does not belong to an user" });
    user.delete();
    res.status(200).send({ message: "Deleted User!" })
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *      description: Use to delete an account (leave empty the body if you don't want to delete an admin account / or you are not the owner)
 *      tags:
 *          - User
 *      security:
 *          - Bearer: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *          - in: body
 *            name: Secret
 *            schema:
 *              type: object
 *              required:
 *                 - adminSecretPassword
 *              properties:
 *                 adminSecretPassword:
 *                   type: string
 *      responses:
 *         '200':
 *           description: Successfully Deleted
 *         '400':
 *           description: User does not exist
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.delete('/:id', verify, verifyAdmin, async(req, res) => {
    let user;
    try {
        user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id)})
    }catch (e) {
        res.status(500).send(e.message)
    }

    if (!user) return res.status(400).send({ message: "The user does not exist" });
    if (parseInt(user.authority.level) === 10){
        if (!req.body.adminSecretPassword) return res.status(403).send("You can't delete an admin account without the owner secret pass")
        if (req.body.adminSecretPassword !== process.env.OWNER_SECRET_PASS) return res.status(403).send("Wrong owner secret pass")
        const APIKeys = await ApiKey.find({creatorID: req.params.id})
        APIKeys.forEach(key => {
            key.delete();
        })
        user.delete();
        res.status(200).send({ message: "Deleted User!" })
    }else{
        user.delete();
        res.status(200).send({ message: "Deleted User!" })
    }

})

module.exports = router;