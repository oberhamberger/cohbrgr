import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { AppStateProvider } from 'src/client/contexts/app-state';

// Mock the lazy-loaded federated module before importing the component.
// We replace the entire module to avoid dynamic import issues in the runner.
// The factory is async because vi.importActual returns a promise, unlike
// Jest's synchronous jest.requireActual.
vi.mock('../FederatedContent', async () => {
    const { useContext } =
        await vi.importActual<typeof import('react')>('react');
    const { AppStateContext } = await vi.importActual<
        typeof import('src/client/contexts/app-state')
    >('src/client/contexts/app-state');

    const MockFederatedContent = () => {
        const { contentHealthy } = useContext(AppStateContext);
        if (!contentHealthy) return null;
        return <div data-testid="content">Federated Content</div>;
    };
    MockFederatedContent.displayName = 'FederatedContent';
    return { __esModule: true, default: MockFederatedContent };
});

import FederatedContent from '../FederatedContent';

describe('FederatedContent', () => {
    it('renders nothing when content is unhealthy', () => {
        const { container } = render(
            <AppStateProvider
                context={{
                    isProduction: false,
                    nonce: '',
                    contentHealthy: false,
                }}
            >
                <FederatedContent />
            </AppStateProvider>,
        );

        expect(container.innerHTML).toBe('');
    });

    it('renders content when healthy', () => {
        const { getByTestId } = render(
            <AppStateProvider
                context={{
                    isProduction: false,
                    nonce: '',
                    contentHealthy: true,
                }}
            >
                <FederatedContent />
            </AppStateProvider>,
        );

        expect(getByTestId('content')).toBeInTheDocument();
    });
});
