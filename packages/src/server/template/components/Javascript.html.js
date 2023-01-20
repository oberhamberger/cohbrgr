"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fs_1 = require("fs");
const path_1 = require("path");
const logger_1 = __importDefault(require("src/server/utils/logger"));
let scriptFiles = [];
try {
    scriptFiles = (0, fs_1.readdirSync)((0, path_1.resolve)(__dirname + '/../client/js')).filter((fileName) => (0, path_1.extname)(fileName) === '.js');
}
catch (err) {
    logger_1.default.warn('HTML-Template: no js files found in current context');
}
const Javascript = (props) => {
    const __initial_state__ = {
        isProduction: props.isProduction,
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("script", { id: "initial-state", nonce: props.nonce, dangerouslySetInnerHTML: {
                    __html: `__initial_state__ = JSON.parse('${JSON.stringify(__initial_state__)}')`,
                } }), scriptFiles.map((file) => ((0, jsx_runtime_1.jsx)("script", { async: true, type: "module", crossOrigin: "use-credentials", nonce: props.nonce, src: `/js/${file}` }, file)))] }));
};
Javascript.displayName = 'SSRJavascript';
exports.default = Javascript;
//# sourceMappingURL=Javascript.html.js.map