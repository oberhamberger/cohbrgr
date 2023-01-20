"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fs_1 = require("fs");
const path_1 = require("path");
const logger_1 = __importDefault(require("src/server/utils/logger"));
let styleFiles = [];
let styleFileContents = '';
try {
    styleFiles = (0, fs_1.readdirSync)((0, path_1.resolve)(__dirname + '/../client/css')).filter((fileName) => (0, path_1.extname)(fileName) === '.css');
    if (styleFiles.length) {
        try {
            styleFiles.forEach((file) => {
                styleFileContents += (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname + '/../client/css/' + file), 'utf8');
            });
        }
        catch (singleFileError) {
            logger_1.default.warn('HTML-Template: error reading css file');
        }
    }
}
catch (allFilesError) {
    logger_1.default.warn('HTML-Template: no css files found in current context');
}
const Stylesheets = (props) => {
    if (!props.isProduction) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: styleFiles.map((file) => ((0, jsx_runtime_1.jsx)("link", { nonce: props.nonce, rel: "stylesheet", href: `/css/${file}` }, file))) }));
    }
    return ((0, jsx_runtime_1.jsx)("style", { nonce: props.nonce, dangerouslySetInnerHTML: { __html: styleFileContents } }));
};
Stylesheets.displayName = 'SSRStylesheets';
exports.default = Stylesheets;
//# sourceMappingURL=Stylesheets.html.js.map