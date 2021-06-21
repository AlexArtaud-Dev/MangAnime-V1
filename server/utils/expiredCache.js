require('dotenv').config();
const SearchCache = require('../models/SearchCache');


module.exports = function(interval) {
    setInterval(() => {
        const ts = new Date();
        console.log(`${ts.toLocaleString()} - Expired Cache Deletion script is running`)
        SearchCache.find({expirationDate: {$lte: Date.now()}}, function(err, results) {
            if (err) {
                console.log({ error: err.message, message: "An error occured while deleting expired cache" })
            } else {
                results.forEach(result => {
                    result.delete();
                })
            }
        });
    }, interval);
}