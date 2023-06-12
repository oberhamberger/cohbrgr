import { Request, Response } from 'express';
import { HtmlValidate, ConfigData } from 'html-validate';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import 'html-validate/jest';
import render from 'src/server/middleware/render';

describe('render middleware', () => {
    let mockRequest: MockRequest<Request>;
    let mockResponse: MockResponse<Response>;

    const htmlValidatorConfig: ConfigData = {
        extends: ['html-validate:document'],
        root: true,
        rules: {
            'require-sri': 'off',
        },
    };
    const htmlvalidate = new HtmlValidate(htmlValidatorConfig);

    it('startpage should return valid html and return 200', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });

        mockResponse = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });

        await render(true, true)(
            mockRequest,
            mockResponse
        );

        mockResponse.on('end', () => {
            debugger;
        });

        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';

        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);

        htmlvalidate.validateString(htmlResponse).then((report) => {
            expect(report.valid).toEqual(true);
            expect(report.errorCount).toBeFalsy();
            expect(report.warningCount).toBeFalsy();
        });
    });

    it('not found page should return valid html and return status 404', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/asdf',
        });

        mockResponse = httpMocks.createResponse();

        await render(true, true)(
            mockRequest,
            mockResponse
        );

        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';

        expect(mockResponse.statusCode).toEqual(404);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);

        htmlvalidate.validateString(htmlResponse).then((report) => {
            expect(report.valid).toEqual(true);
            expect(report.errorCount).toBeLessThan(1);
        });
    });

    it('offlinepage should return valid html', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/offline',
        });

        mockResponse = httpMocks.createResponse();

        await render(true, true)(
            mockRequest,
            mockResponse
        );

        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';

        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);

        htmlvalidate.validateString(htmlResponse).then((report) => {
            expect(report.valid).toEqual(true);
            expect(report.errorCount).toBeLessThan(1);
        });
    });
});
