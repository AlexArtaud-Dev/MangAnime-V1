const mongoose = require('mongoose');
require('dotenv').config();



const SearchCacheSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    result: {
        type: Object,
        required: true
    },
    creationDate: {
        type: Date,
        default: (Date.now()),
        required: true
    },
    expirationDate: {
        type: Date,
        default: (Date.now() + 86400000 * 2),
        required: true
    }
});



module.exports = mongoose.model('SearchCache', SearchCacheSchema)