"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = __importDefault(require("src/client/components/navigation"));
const Offline = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "You are Offline!" }), (0, jsx_runtime_1.jsx)("p", { children: "Come back whenever you are ready :)" })] }), (0, jsx_runtime_1.jsx)(navigation_1.default, { children: (0, jsx_runtime_1.jsx)("a", { href: "", children: "refresh" }) })] }));
};
Offline.displayName = 'Offline';
exports.default = Offline;
//# sourceMappingURL=Offline.js.map