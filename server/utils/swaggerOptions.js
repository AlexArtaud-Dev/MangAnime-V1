const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Manga Web Scrapper API",
            contact : {
                name: "AlexArtaud-Dev"
            },
            version: "Alpha 1.2.0",
            servers: ["https://86.221.232.6:5000"]
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
                name: "Server"
            },
            {
                name: "User"
            }
        ],
    },
    apis: ["app.js", './routes/*.js']
};
module.exports = swaggerOptions;