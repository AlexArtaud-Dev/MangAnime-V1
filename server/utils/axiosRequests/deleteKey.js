require('dotenv').config();
const APIKEY = require('../../models/ApiKey');
const axios = require('axios');
const uuidAPIKey = require('uuid-apikey')


module.exports = function(key, checkDate) {
    if (checkDate === true) {
        if (key.expirationDate <= Date.now()) {
            keyAPI = uuidAPIKey.toAPIKey(key.UUID);
            axios.delete(`http://localhost:5000/api/key/${keyAPI}`, {
                    headers: {
                        'admin-token': `${process.env.ADMIN_TOKEN}`
                    },
                })
                .catch(function(error) {
                    console.log(error.message);
                });
        }
    } else {
        keyAPI = uuidAPIKey.toAPIKey(key.UUID);
        axios.delete(`http://localhost:5000/api/key/${keyAPI}`, {
                headers: {
                    'admin-token': `${process.env.ADMIN_TOKEN}`
                },
            })
            .catch(function(error) {
                console.log(error.message);
            });
    }


}