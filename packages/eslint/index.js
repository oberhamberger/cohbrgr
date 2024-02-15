const baseConfig = require('./eslint.base');
const clientConfig = require('./eslint.client');
const serverConfig = require('./eslint.server');

module.exports = {
    base: baseConfig, 
    client: clientConfig,
    server: serverConfig
};
