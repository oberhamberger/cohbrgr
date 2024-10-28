import environments from '@cohbrgr/environments';

const contentPort = environments.default.content.port;
const contentUrl = process.env['DOCKER'] === 'true' ? environments.default.content.location : `${environments.default.content.location}:${contentPort}`;

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

export default () => {
  const clientFederationConfig = getClientFederationConfig();
  const serverFederationConfig = getServerFederationConfig();
  return {
    client: clientFederationConfig,
    server: serverFederationConfig
  };
};
