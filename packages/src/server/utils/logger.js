"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const Logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`), winston_1.default.format.colorize({ all: true })),
    // available log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
    transports: [new winston_1.default.transports.Console()],
});
exports.default = Logger;
//# sourceMappingURL=logger.js.map