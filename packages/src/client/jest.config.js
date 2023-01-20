"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_config_base_1 = __importDefault(require("../../../jest.config.base"));
const config = {
    ...jest_config_base_1.default,
    displayName: 'client',
    testEnvironment: 'jsdom',
    rootDir: './../../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/client/**/__tests__/**/*.+(ts|tsx|js)',
        '**/client/**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map