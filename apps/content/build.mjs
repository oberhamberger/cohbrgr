const getServerFederationConfig = () => {
  return {
    filename: 'remoteEntry.js',
    name: 'content',
    moduleName: 'content',
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
    moduleName: 'content',
    isServer: false,
    dts: false,
    exposes: {
      'content': 'src/client/components/content'
    }
  };
};

export default () => {
  const clientFederationConfig = getClientFederationConfig();
  const serverFederationConfig = getServerFederationConfig();
  return {
    client: clientFederationConfig,
    server: serverFederationConfig
  };
};
