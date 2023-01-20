"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const http_1 = require("src/client/contexts/http");
const navigation_1 = __importDefault(require("src/client/components/navigation"));
const NotFound = () => {
    return ((0, jsx_runtime_1.jsxs)(http_1.HttpStatus, { code: 404, children: [(0, jsx_runtime_1.jsx)("main", { children: (0, jsx_runtime_1.jsx)("h1", { children: "Not Found" }) }), (0, jsx_runtime_1.jsx)(navigation_1.default, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: "return" }) })] }));
};
NotFound.displayName = 'NotFound';
exports.default = NotFound;
//# sourceMappingURL=NotFound.js.map