"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Layout_module_scss_1 = __importDefault(require("src/client/components/layout/Layout.module.scss"));
const Layout = ({ children }) => {
    return (0, jsx_runtime_1.jsx)("div", { className: Layout_module_scss_1.default.layout, children: children });
};
Layout.displayName = 'Layout';
exports.default = Layout;
//# sourceMappingURL=Layout.js.map