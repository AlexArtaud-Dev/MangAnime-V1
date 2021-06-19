const { required } = require('joi');
const mongoose = require('mongoose');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6

    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    profile: {
        picture: {
            type: String,
            required: false,
            default: process.env.DEFAUT_PROFILE_PICTURE
        },
        fullname: {
            type: String,
            required: false
        },
    },
    authority: {
        level: {
            type: Number,
            required: true,
            default: 0
        },
        adminToken: {
            type: String,
            default: "null"
        }
    },
    watchedAnimes: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('User', userSchema)