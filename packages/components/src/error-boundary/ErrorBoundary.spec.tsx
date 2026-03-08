import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ErrorBoundary from './ErrorBoundary';

const ThrowingComponent = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Content</div>
            </ErrorBoundary>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders fallback when a child throws', () => {
        render(
            <ErrorBoundary fallback={<div data-testid="fallback">Error</div>}>
                <ThrowingComponent />
            </ErrorBoundary>,
        );
        expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('renders nothing when a child throws and no fallback is provided', () => {
        const { container } = render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>,
        );
        expect(container.innerHTML).toBe('');
    });

    it('logs the error to console.error', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>,
        );
        expect(console.error).toHaveBeenCalledWith(
            'ErrorBoundary caught an error:',
            expect.any(Error),
            expect.objectContaining({ componentStack: expect.any(String) }),
        );
    });

    it('has displayName set to ErrorBoundary', () => {
        expect(ErrorBoundary.displayName).toBe('ErrorBoundary');
    });
});
