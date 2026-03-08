import { useContext } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { AppStateContext, AppStateProvider } from './app-state';

const TestConsumer = () => {
    const context = useContext(AppStateContext);
    return (
        <div>
            <span data-testid="isProduction">
                {String(context.isProduction)}
            </span>
            <span data-testid="nonce">{context.nonce}</span>
        </div>
    );
};

describe('app-state context', () => {
    describe('AppStateContext', () => {
        it('should have default values', () => {
            render(
                <AppStateContext.Provider
                    value={{ isProduction: false, nonce: '' }}
                >
                    <TestConsumer />
                </AppStateContext.Provider>,
            );

            expect(screen.getByTestId('isProduction')).toHaveTextContent(
                'false',
            );
            expect(screen.getByTestId('nonce')).toHaveTextContent('');
        });
    });

    describe('AppStateProvider', () => {
        it('should provide context values to children', () => {
            render(
                <AppStateProvider
                    context={{ isProduction: true, nonce: 'test-nonce' }}
                >
                    <TestConsumer />
                </AppStateProvider>,
            );

            expect(screen.getByTestId('isProduction')).toHaveTextContent(
                'true',
            );
            expect(screen.getByTestId('nonce')).toHaveTextContent('test-nonce');
        });

        it('should use default context when not provided', () => {
            render(
                <AppStateProvider context={undefined as never}>
                    <TestConsumer />
                </AppStateProvider>,
            );

            expect(screen.getByTestId('isProduction')).toHaveTextContent(
                'false',
            );
        });
    });
});
