const mongoose = require('mongoose');

const AnimeInfos = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    fame: {
        type: Number,
        default: 0,
        required: true
    },
    alreadyUpVoted: {
        type: Array,
        default: [],
        userID: {
            type: String
        },
        date: {
            type: Date,
        }
    }
});



module.exports = mongoose.model('AnimeInfos', AnimeInfos)