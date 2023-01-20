"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("react-dom/server");
const Index_html_1 = __importDefault(require("src/server/template/Index.html"));
const logger_1 = __importDefault(require("src/server/utils/logger"));
const methodDetermination_1 = require("./methodDetermination");
const doctype = '<!DOCTYPE html>';
const render = (isProduction, useClientSideRendering) => async (req, res) => {
    const httpContext = {};
    const markup = await (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(Index_html_1.default, { isProduction: isProduction, location: req.url, useCSR: useClientSideRendering, nonce: res.locals.nonce, httpContextData: httpContext }));
    const renderStatusCode = httpContext.statusCode || 200;
    if (renderStatusCode < 300) {
        logger_1.default.info(`Rendered App with path: ${req.url}`);
    }
    else if (renderStatusCode < 400) {
        logger_1.default.warn(`Redirected: ${req.url}`);
    }
    else if (renderStatusCode < 500) {
        logger_1.default.warn(`Not found: ${req.url}`);
    }
    else {
        logger_1.default.error(`Major Server Error while rendering: ${req.url}`);
    }
    res.status(renderStatusCode);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (req.method === methodDetermination_1.HttpMethod.GET) {
        res.send(doctype + markup);
    }
    else if (req.method === methodDetermination_1.HttpMethod.HEAD) {
        res.send();
    }
    res.end();
};
exports.default = render;
//# sourceMappingURL=render.js.map