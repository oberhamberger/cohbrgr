"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
require("src/assets/styles/index.scss");
const layout_1 = __importDefault(require("src/client/components/layout"));
const content_1 = __importDefault(require("src/client/components/pages/content"));
const offline_1 = __importDefault(require("src/client/components/pages/offline"));
const not_found_1 = __importDefault(require("src/client/components/pages/not-found"));
var clientRoutes;
(function (clientRoutes) {
    clientRoutes["start"] = "/";
    clientRoutes["offline"] = "/offline";
    clientRoutes["notFound"] = "*";
})(clientRoutes = exports.clientRoutes || (exports.clientRoutes = {}));
const App = () => {
    return ((0, jsx_runtime_1.jsx)(layout_1.default, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: clientRoutes.start, element: (0, jsx_runtime_1.jsx)(content_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: clientRoutes.offline, element: (0, jsx_runtime_1.jsx)(offline_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: clientRoutes.notFound, element: (0, jsx_runtime_1.jsx)(not_found_1.default, {}) })] }) }));
};
App.displayName = 'App';
exports.default = App;
//# sourceMappingURL=App.js.map