"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("@testing-library/jest-dom");
const react_1 = require("@testing-library/react");
const Content_1 = __importDefault(require("src/client/components/pages/content/Content"));
describe('Main Content Component', () => {
    it('displays greeting', async () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Content_1.default, {}));
        const items = await react_1.screen.findAllByText('Hi!');
        expect(items).toHaveLength(1);
    });
    it('displays navigation', async () => {
        const { container } = (0, react_1.render)((0, jsx_runtime_1.jsx)(Content_1.default, {}));
        expect(container.getElementsByTagName('nav').length).toEqual(1);
        expect(container.getElementsByTagName('li').length).toEqual(3);
    });
});
//# sourceMappingURL=Content.spec.js.map