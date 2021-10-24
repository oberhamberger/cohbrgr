import { Request, Response } from 'express';
import { HtmlValidate, ConfigData } from 'html-validate';
import httpMocks from 'node-mocks-http';
import 'html-validate/jest';
import render from 'src/server/middleware/render';

describe('methodDetermination middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse;
    const htmlValidatorConfig: ConfigData = {
        extends: ['html-validate:document'],
        root: true,
        rules: {
            'require-sri': 'off',
        },
    };
    const htmlvalidate = new HtmlValidate(htmlValidatorConfig);

    it('should return valid html', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });

        mockResponse = httpMocks.createResponse();

        await render(true, 'test-nonce')(
            mockRequest as Request,
            mockResponse as Response,
        );

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
