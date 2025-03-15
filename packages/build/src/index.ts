
export * from './configs/rspack.base.config';
export * from './configs/rspack.client.config';
export * from './configs/rspack.federated.config';
export * from './configs/rspack.server.config';
export * from './loader/style.loader';
export * from './utils/constants';
export * from './utils/helpers';


// const federationPlugins = moduleFederationPlugin(isShell);

// const clientConfig = getRspackClientConfig(federationPlugins.client);
// const serverConfig = getRspackServerConfig();


// configs.forEach((config) => {
//     if (!config) {
//         Logger.error('No Config');
//         throw 'No Config';
//     }

//     const compiler = rspack(config);
//     const compilerCallback = (err: Error | null, result: MultiStats | undefined) => {
//         if (err) {
//             Logger.error(err.stack);
//         }
//         if (!result) {
//             Logger.warn('Compiler returned no result.');
//             throw 'No Result from Compiler';
//         }

//         const rawMessages = result.toJson({});
//         if (rawMessages.errors?.length) {
//             rawMessages.errors.forEach((e) => {
//                 Logger.error(e);
//             });
//             throw rawMessages.errors;
//         }
//         if (rawMessages.warnings?.length) {
//             rawMessages.warnings.forEach((w) => {
//                 Logger.warn(w);
//             });
//         }
//         if (!rawMessages.errors?.length && !rawMessages.warnings?.length) {
//             Logger.info(`compiled successfully.`);
//         }

//         if (isSSG) {
//             staticSiteGenerator();
//         }
//     };

//     if (isWatch) {
//         compiler.watch({}, compilerCallback);
//     } else {
//         try {

//             compiler.run(compilerCallback);
//         } catch (e) {
//             Logger.error(e);
//         }
//     }
// });
