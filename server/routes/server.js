const router = require('express').Router();
require('dotenv').config();
const verify = require('./middlewares/verifyToken');
const verifyAdmin = require('./middlewares/verifyAdminToken');

const pidusage = require('pidusage')

/**
 * @swagger
 * /server/cpu:
 *   get:
 *      description: Use to get server cpu informations
 *      tags:
 *          - Server
 *      security:
 *          - Bearer: []
 *      responses:
 *         '200':
 *           description: Successfull Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal servor error
 */
router.get('/cpu', verify, verifyAdmin, async(req, res) => {
    function msToHMS( duration ) {

        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds ;
    }
    const stats = await pidusage(process.pid)
    res.status(200).send({
        cpuUsage: stats.cpu,
        ram: parseInt((parseInt(stats.memory) / (1024*1024)).toFixed(2)),
        elapsed : msToHMS(stats.elapsed)
    })
})



module.exports = router;