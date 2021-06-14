const fs = require('fs');
const open = require('open');
const cors = require('cors');
const https = require('https')
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require('./utils/mongoose');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express")
const deleteExpired = require('./utils/expiredDeletion');
const serverKey = fs.readFileSync("./SSL_Cert/server.key")
const serverCert = fs.readFileSync("./SSL_Cert/server.cert")

// Connect to DB
db.init();


// Extended : https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Manga Web Scrapper API",
            contact : {
                name: "AlexArtaud-Dev"
            },
            version: "1.0.0",
            servers: ["https://localhost:5000"]
        },
        basePath: "/api",
        paths : {},
        securityDefinitions: {
            Bearer: {
                in: "header",
                name: "auth-token",
                description: "",
                required: true,
                type: "apiKey",
            }
        },
        tags: [
            {
                name: "Anime"
            },
            {
                name: "Auth"
            },
            {
                name: "Key"
            },
            {
                name: "Scrapper"
            },
            {
                name: "User"
            }
        ],
},
    apis: ["app.js", './routes/*.js']
};

// Swagger Docs Route and Options
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/v1/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middleware
app.use(express.json());

// Allow Access-Control-Allow-Origin from *
app.use(cors({ origin: '*' }));


// Import Routes
const animeRoute = require('./routes/anime');
const scrapperRoute = require('./routes/scrapper');
const usersRoute = require('./routes/users');
const apikeyRoute = require('./routes/ApiKey');
const authRoute = require('./routes/auth');

// Route Middlewares
app.use('/api/anime', animeRoute);
app.use('/api/scrapper', scrapperRoute);
app.use('/api/key', apikeyRoute);
app.use('/api/user', authRoute);
app.use('/api/users', usersRoute);

// Server Listening
https.createServer({
    key: serverKey,
    cert: serverCert
}, app)
    .listen(port, function () {
        console.clear();
        console.log(`APP listening on port ${port}! Go to https://localhost:${port}/`)
        // open(`https://localhost:${port}/v1/swagger`, {app: 'firefox'});
    })
deleteExpired(3600000);