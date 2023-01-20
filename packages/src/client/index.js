"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("src/client/components/App"));
const register_service_worker_1 = __importDefault(require("src/client/utils/register-service-worker"));
const app_state_1 = require("src/client/contexts/app-state");
const root = document.getElementById('root');
if (root) {
    (0, client_1.hydrateRoot)(root, (0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(app_state_1.AppStateProvider, { context: window.__initial_state__, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }) }));
}
if (window.__initial_state__?.isProduction) {
    (0, register_service_worker_1.default)();
}
//# sourceMappingURL=index.js.map