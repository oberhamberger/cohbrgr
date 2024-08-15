"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _environments = _interopRequireDefault(require("@cohbrgr/environments"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const contentPort = _environments.default.content.port;
const contentUrl = process.env['DOCKER'] === 'true' ? _environments.default.content.location : `${_environments.default.content.location}:${contentPort}`;
const getServerFederationConfig = () => {
  return {
    filename: 'remoteEntry.js',
    name: 'shell',
    isServer: true,
    dts: false,
    remotes: {
      '@cohbrgr/content': `content@${contentUrl}/server/remoteEntry.js`
    }
  };
};
const getClientFederationConfig = () => {
  return {
    filename: 'container.js',
    name: 'shell',
    isServer: false,
    dts: false,
    remotes: {
      '@cohbrgr/content': `content@${contentUrl}/client/remoteEntry.js`
    }
  };
};
var _default = () => {
  const clientFederationConfig = getClientFederationConfig();
  const serverFederationConfig = getServerFederationConfig();
  return {
    client: clientFederationConfig,
    server: serverFederationConfig
  };
};
exports.default = _default;