import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cohbrgr.app',
  appName: 'cohbrgr',
  webDir: 'dist/server',
  server: {
    url: '',
    androidScheme: 'http',
    allowNavigation: ['localhost']
  },
};

export default config;
