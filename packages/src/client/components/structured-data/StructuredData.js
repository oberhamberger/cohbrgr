"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const app_state_1 = require("src/client/contexts/app-state");
const buildJsonLd = () => {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Christian Oberhamberger',
        description: 'My name is Christian. I am a Frontend Developer at Netconomy. I mainly work with React and Node.js on online commerce platforms. *sipping coffee*',
        url: 'https://cohbrgr.com',
    });
};
const jsonLd = buildJsonLd();
const StructuredData = () => {
    const { nonce } = (0, react_1.useContext)(app_state_1.AppStateContext);
    return ((0, jsx_runtime_1.jsx)("script", { nonce: nonce, type: "application/ld+json", suppressHydrationWarning: true, dangerouslySetInnerHTML: {
            __html: jsonLd,
        } }));
};
StructuredData.displayName = 'StrucuredData';
exports.default = StructuredData;
//# sourceMappingURL=StructuredData.js.map