"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_validate_1 = require("html-validate");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
require("html-validate/jest");
const render_1 = __importDefault(require("src/server/middleware/render"));
describe('render middleware', () => {
    let mockRequest;
    let mockResponse;
    const htmlValidatorConfig = {
        extends: ['html-validate:document'],
        root: true,
        rules: {
            'require-sri': 'off',
        },
    };
    const htmlvalidate = new html_validate_1.HtmlValidate(htmlValidatorConfig);
    it('startpage should return valid html and return 200', async () => {
        mockRequest = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/',
        });
        mockResponse = node_mocks_http_1.default.createResponse();
        await (0, render_1.default)(true, true)(mockRequest, mockResponse);
        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';
        const report = htmlvalidate.validateString(htmlResponse);
        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);
        expect(report.valid).toEqual(true);
        expect(report.errorCount).toBeFalsy();
        expect(report.warningCount).toBeFalsy();
    });
    it('not found page should return valid html and return status 404', async () => {
        mockRequest = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/asdf',
        });
        mockResponse = node_mocks_http_1.default.createResponse();
        await (0, render_1.default)(true, true)(mockRequest, mockResponse);
        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';
        const report = htmlvalidate.validateString(htmlResponse);
        expect(mockResponse.statusCode).toEqual(404);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);
        expect(report.valid).toEqual(true);
        expect(report.errorCount).toBeLessThan(1);
    });
    it('offlinepage should return valid html', async () => {
        mockRequest = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/offline',
        });
        mockResponse = node_mocks_http_1.default.createResponse();
        await (0, render_1.default)(true, true)(mockRequest, mockResponse);
        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';
        const report = htmlvalidate.validateString(htmlResponse);
        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);
        expect(report.valid).toEqual(true);
        expect(report.errorCount).toBeLessThan(1);
    });
});
//# sourceMappingURL=render.spec.js.map