const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require("../../models/User")

module.exports = async function(req, res, next) {
    const user = await User.findOne({_id: req.user._id});
    if (!user) return res.status(400).send({ message: "Acces Denied" })
    let adminTokenSiphed;
    if (user.authority.level === 10 && user.authority.adminToken){
        adminTokenSiphed = user.authority.adminToken;
    }else{
        adminTokenSiphed = undefined;
    }
    if (!adminTokenSiphed) return res.status(400).send({ message: "Acces Denied" })
    try {
        const validToken = await bcrypt.compare(process.env.ADMIN_TOKEN, adminTokenSiphed);
        if (!validToken) return res.status(401).send({ error: "Invalid Admin Token - Check Database" });
        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}