"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = void 0;
const logger_1 = __importDefault(require("src/server/utils/logger"));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["CONNECT"] = "CONNECT";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
const methodDetermination = (req, res, next) => {
    if (req.method !== HttpMethod.GET && req.method !== HttpMethod.HEAD) {
        logger_1.default.warn(`Unexpected Request with Method: ${req.method} on ${req.originalUrl}`);
        res.statusCode = 405;
        return res.send('Method Not allowed');
    }
    next();
};
exports.default = methodDetermination;
//# sourceMappingURL=methodDetermination.js.map