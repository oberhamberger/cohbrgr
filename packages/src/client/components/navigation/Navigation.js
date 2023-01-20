"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Navigation_module_scss_1 = __importDefault(require("src/client/components/navigation/Navigation.module.scss"));
const Navigation = ({ children }) => {
    const navigationNodes = react_1.Children.map(children, (child) => {
        return (0, jsx_runtime_1.jsx)("li", { children: child });
    });
    return ((0, jsx_runtime_1.jsx)("nav", { className: Navigation_module_scss_1.default.navigation, children: (0, jsx_runtime_1.jsx)("ul", { children: navigationNodes }) }));
};
Navigation.displayName = 'Navigation';
exports.default = Navigation;
//# sourceMappingURL=Navigation.js.map