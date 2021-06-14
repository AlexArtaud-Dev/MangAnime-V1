require('dotenv').config();
const axios = require('axios');
const https = require('https');



module.exports = function(keyAPI) {
    const agent = new https.Agent({
        rejectUnauthorized: false
    })
    return axios.get(`https://localhost:5000/api/key/${keyAPI}`, {
            httpsAgent: agent,
            headers: {
                'admin-token': `${process.env.ADMIN_TOKEN_SCIPHERED}`
            },
        })
        .then((response) => {
            this.response = response.status;
            return this.response;
        })
        .catch((error) => {
            this.error = error.message
            return this.error;
        })
}