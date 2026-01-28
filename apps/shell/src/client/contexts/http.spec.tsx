import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';

import { HttpContext, HttpContextData, HttpProvider, HttpStatus } from './http';

const TestConsumer = () => {
    const context = useContext(HttpContext);
    return (
        <div>
            <span data-testid="statusCode">{context?.statusCode ?? 'none'}</span>
            <span data-testid="redirectLocation">{context?.redirectLocation ?? 'none'}</span>
        </div>
    );
};

describe('http context', () => {
    describe('HttpContext', () => {
        it('should have null as default value', () => {
            render(
                <HttpContext.Provider value={null}>
                    <TestConsumer />
                </HttpContext.Provider>,
            );

            expect(screen.getByTestId('statusCode')).toHaveTextContent('none');
        });
    });

    describe('HttpProvider', () => {
        it('should provide context values to children', () => {
            const contextData: HttpContextData = {
                statusCode: 200,
                redirectLocation: '/home',
            };

            render(
                <HttpProvider context={contextData}>
                    <TestConsumer />
                </HttpProvider>,
            );

            expect(screen.getByTestId('statusCode')).toHaveTextContent('200');
            expect(screen.getByTestId('redirectLocation')).toHaveTextContent('/home');
        });
    });

    describe('HttpStatus', () => {
        it('should set status code in context', () => {
            const contextData: HttpContextData = {};

            render(
                <HttpProvider context={contextData}>
                    <HttpStatus code={404}>
                        <span>Not Found</span>
                    </HttpStatus>
                </HttpProvider>,
            );

            expect(contextData.statusCode).toBe(404);
            expect(screen.getByText('Not Found')).toBeInTheDocument();
        });

        it('should render children without context', () => {
            render(
                <HttpStatus code={500}>
                    <span>Error</span>
                </HttpStatus>,
            );

            expect(screen.getByText('Error')).toBeInTheDocument();
        });

        it('should handle null context gracefully', () => {
            render(
                <HttpContext.Provider value={null}>
                    <HttpStatus code={404}>
                        <span>Content</span>
                    </HttpStatus>
                </HttpContext.Provider>,
            );

            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
});
