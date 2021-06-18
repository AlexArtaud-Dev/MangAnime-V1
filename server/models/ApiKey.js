const mongoose = require('mongoose');
require('dotenv').config();



const ApiKeySchema = new mongoose.Schema({
    UUID: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: (Date.now()),
        required: true
    },
    expirationDate: {
        type: Date,
        default: (Date.now() + 86400000 * 7),
        required: true
    },
    creatorID: {
        type: String,
        required: true
    }
});



module.exports = mongoose.model('ApiKey', ApiKeySchema)