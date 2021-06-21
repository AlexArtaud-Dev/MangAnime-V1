/* craco.config.js */
const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#a02669',
                            '@primary-3': '#97b6f2',
                            '@text-color-secondary': '#FFFFFF',
                            '@body-background': '#090013',
                            '@font-family': 'Lato, sans-serif'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};