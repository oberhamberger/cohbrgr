"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStateProvider = exports.AppStateContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const initialAppStateContext = {
    isProduction: false,
};
exports.AppStateContext = (0, react_1.createContext)(initialAppStateContext);
const AppStateProvider = ({ children, context = initialAppStateContext, }) => {
    return ((0, jsx_runtime_1.jsx)(exports.AppStateContext.Provider, { value: context, children: children }));
};
exports.AppStateProvider = AppStateProvider;
//# sourceMappingURL=app-state.js.map