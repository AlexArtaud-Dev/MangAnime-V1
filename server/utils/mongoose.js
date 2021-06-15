require('dotenv').config();
const mongoose = require("mongoose");
const ts = new Date();
module.exports = {
    init: () => {
        const mongOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false, // Don't build indexes
            poolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        }

        mongoose.connect(process.env.DB_CONNECTION, mongOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => {
            console.log(ts.toLocaleString() + " - Connected to Mongo Cluster (" + mongoose.connection.host + ")");
        });
    }
}