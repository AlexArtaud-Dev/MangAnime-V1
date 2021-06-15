
require('dotenv').config();
const APIKEY = require('../models/ApiKey');
const deleteKey = require('../utils/axiosRequests/deleteKey')

module.exports = function(interval) {
    setInterval(() => {
        const ts = new Date();
        console.log(`${ts.toLocaleString()} - Expired API Keys Deletion script is running`)
        APIKEY.find({}, function(err, result) {
            if (err) {
                console.log({ error: err.message, message: "An error occured while deleting expired keys" })
            } else {
                result.forEach(key => {
                    deleteKey(key, true);
                });
            }
        });
    }, interval);
}