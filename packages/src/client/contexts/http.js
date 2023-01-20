"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.HttpProvider = exports.HttpContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.HttpContext = (0, react_1.createContext)(null);
const HttpProvider = ({ children, context }) => {
    return ((0, jsx_runtime_1.jsx)(exports.HttpContext.Provider, { value: context, children: children }));
};
exports.HttpProvider = HttpProvider;
function HttpStatus({ code, children, }) {
    // TODO: This might not work properly with suspense, figure out how to prevent adding
    // a new item for renders that aren't "committed"
    const ctx = (0, react_1.useContext)(exports.HttpContext);
    if (ctx)
        ctx.statusCode = code;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
exports.HttpStatus = HttpStatus;
//# sourceMappingURL=http.js.map