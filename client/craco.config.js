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
                            '@layout-trigger-background': '#1d0040',
                            '@message-notice-content-bg': '#1d0040',
                            '@menu-dark-bg' : '#100024',
                            '@menu-dark-inline-submenu-bg': '#180b29',
                            '@menu-item-height' : '70px',
                            '@menu-inline-toplevel-item-height': '70px',
                            '@modal-header-bg': '#1d0040',
                            '@modal-content-bg': '#1d0040',
                            '@modal-footer-bg': '#1d0040',
                            '@body-background': '#090013',
                            '@select-dropdown-bg' : '#100024',
                            '@select-item-selected-bg': '#a02669',
                            '@select-selection-item-bg': '#100024',
                            '@tooltip-bg': '#a02669',
                            '@tooltip-max-width' : '450px',
                            '@progress-circle-text-font-size' : '3em',
                            '@font-family': 'Lato, sans-serif',
                            '@spin-dot-size-lg' : "50px"
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};