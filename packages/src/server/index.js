"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const nocache_1 = __importDefault(require("nocache"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("src/server/utils/logger"));
const logging_1 = __importDefault(require("src/server/middleware/logging"));
const methodDetermination_1 = __importDefault(require("src/server/middleware/methodDetermination"));
const render_1 = __importDefault(require("src/server/middleware/render"));
const crypto_1 = require("crypto");
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = 'dist/client';
const useClientSideRendering = true;
const app = (0, express_1.default)();
if (isProduction) {
    app.use((0, express_rate_limit_1.default)({
        windowMs: 10 * 60 * 1000,
        max: 500,
        handler: (request, response, next, options) => {
            logger_1.default.log('warn', `Restricted request from ${request.ip} for ${request.path}`);
            return response
                .status(options.statusCode)
                .send(options.message);
        },
    }));
}
app.use((0, nocache_1.default)());
app.use((0, logging_1.default)(isProduction));
app.use(methodDetermination_1.default);
app.use((0, compression_1.default)());
app.use(express_1.default.static(staticPath, { dotfiles: 'ignore' }));
app.use((req, res, next) => {
    res.locals.cspNonce = (0, crypto_1.randomBytes)(16).toString('hex');
    (0, helmet_1.default)({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'script-src': [`'nonce-${res.locals.cspNonce}'`],
                'manifest-src': ["'self'"],
                'connect-src': ["'self'"],
                'worker-src': ["'self'"],
                'form-action': ["'none'"],
                'default-src': ["'none'"],
            },
        },
    });
    next();
});
app.use((0, render_1.default)(isProduction, useClientSideRendering));
// starting the server
const server = app.listen(port, () => {
    logger_1.default.log('info', `Server started at http://localhost:${port} in ${isProduction ? 'production' : 'development'} mode`);
});
// stopping the server correctly
const closeGracefully = async () => {
    await server.close();
    logger_1.default.log('info', `Server closed.`);
    process.exit();
};
process.on('SIGTERM', closeGracefully);
process.on('SIGINT', closeGracefully);
//# sourceMappingURL=index.js.map