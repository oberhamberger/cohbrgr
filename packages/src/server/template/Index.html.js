"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("react-router-dom/server");
const App_1 = __importStar(require("src/client/components/App"));
const Javascript_html_1 = __importDefault(require("src/server/template/components/Javascript.html"));
const Stylesheets_html_1 = __importDefault(require("src/server/template/components/Stylesheets.html"));
const http_1 = require("src/client/contexts/http");
const app_state_1 = require("src/client/contexts/app-state");
const Index = (props) => {
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "en", children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "UTF-8" }), (0, jsx_runtime_1.jsx)("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), (0, jsx_runtime_1.jsx)("meta", { httpEquiv: "X-UA-Compatible", content: "ie=edge" }), (0, jsx_runtime_1.jsx)("link", { rel: "canonical", href: "https://cohbrgr.com/" }), (0, jsx_runtime_1.jsx)("title", { children: "Christian Oberhamberger" }), (0, jsx_runtime_1.jsx)("meta", { name: "description", content: "My name is Christian. I am a Frontend Developer at Netconomy. I mainly work with React and Node.js on online commerce platforms. *sipping coffee*" }), (0, jsx_runtime_1.jsx)("meta", { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#fff1ee" }), (0, jsx_runtime_1.jsx)("meta", { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#001e26" }), (0, jsx_runtime_1.jsx)("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }), (0, jsx_runtime_1.jsx)("link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }), (0, jsx_runtime_1.jsx)("link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }), (0, jsx_runtime_1.jsx)("link", { rel: "manifest", href: "/manifest.json" }), (0, jsx_runtime_1.jsx)(Stylesheets_html_1.default, { isProduction: props.isProduction, nonce: props.nonce })] }), (0, jsx_runtime_1.jsxs)("body", { children: [(0, jsx_runtime_1.jsx)("div", { id: "root", children: (0, jsx_runtime_1.jsx)(app_state_1.AppStateProvider, { context: {
                                nonce: props.nonce,
                                isProduction: props.isProduction,
                            }, children: (0, jsx_runtime_1.jsx)(http_1.HttpProvider, { context: props.httpContextData, children: (0, jsx_runtime_1.jsx)(server_1.StaticRouter, { location: props.location, children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }) }) }), props.useCSR && !(props.location === App_1.clientRoutes.offline) && ((0, jsx_runtime_1.jsx)(Javascript_html_1.default, { nonce: props.nonce, isProduction: props.isProduction }))] })] }));
};
Index.displayName = 'SSRIndex';
exports.default = Index;
//# sourceMappingURL=Index.html.js.map