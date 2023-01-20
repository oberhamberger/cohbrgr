"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/server/utils/logger"));
const logging = (isProduction) => (req, res, next) => {
    if (!isProduction) {
        logger_1.default.info(`Requesting: ${req.url}`);
    }
    else {
        logger_1.default.info(`${req.ip} requests: ${req.url}`);
    }
    next();
};
exports.default = logging;
//# sourceMappingURL=logging.js.map