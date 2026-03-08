import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Navigation from './Navigation';

describe('Navigation component', () => {
    it('renders a nav element', () => {
        render(
            <Navigation>
                <a href="/">Home</a>
            </Navigation>,
        );
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders children wrapped in list items', () => {
        render(
            <Navigation>
                <a href="/">Home</a>
                <a href="/about">About</a>
            </Navigation>,
        );
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
    });

    it('renders links inside list items', () => {
        render(
            <Navigation>
                <a href="/">Home</a>
                <a href="/about">About</a>
            </Navigation>,
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders an unordered list', () => {
        render(
            <Navigation>
                <a href="/">Home</a>
            </Navigation>,
        );
        expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has displayName set to Navigation', () => {
        expect(Navigation.displayName).toBe('Navigation');
    });
});
