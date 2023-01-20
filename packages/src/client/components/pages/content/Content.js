"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = __importDefault(require("src/client/components/navigation"));
const structured_data_1 = __importDefault(require("src/client/components/structured-data"));
const Content = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Hi!" }), (0, jsx_runtime_1.jsx)("h2", { children: "My name is Christian" }), (0, jsx_runtime_1.jsxs)("p", { children: ["I am a Frontend Developer at", ' ', (0, jsx_runtime_1.jsx)("a", { href: "https://www.netconomy.net/", children: "Netconomy" }), ". I mainly work with React and Node.js on online commerce platforms."] })] }), (0, jsx_runtime_1.jsxs)(navigation_1.default, { children: [(0, jsx_runtime_1.jsx)("a", { href: "https://mastodon.social/@cohbrgr", children: "Mastodon" }), (0, jsx_runtime_1.jsx)("a", { href: "https://github.com/oberhamberger", children: "Github" }), (0, jsx_runtime_1.jsx)("a", { href: "https://www.linkedin.com/in/oberhamberger/", children: "LinkedIn" })] }), (0, jsx_runtime_1.jsx)(structured_data_1.default, {})] }));
};
Content.displayName = 'Content';
exports.default = Content;
//# sourceMappingURL=Content.js.map