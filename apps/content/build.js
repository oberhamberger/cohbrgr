"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const getServerFederationConfig = () => {
  return {
    filename: 'remoteEntry.js',
    name: 'content',
    isServer: true,
    dts: false,
    exposes: {
      'content': 'src/client/components/content'
    }
  };
};
const getClientFederationConfig = () => {
  return {
    filename: 'remoteEntry.js',
    name: 'content',
    isServer: false,
    dts: false,
    exposes: {
      'content': 'src/client/components/content'
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