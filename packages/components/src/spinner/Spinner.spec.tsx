import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Spinner from './Spinner';

describe('Spinner component', () => {
    it('displays spinner', async () => {
        render(<Spinner />);
        const items = await screen.findAllByTestId('spinner');
        expect(items).toHaveLength(1);
    });

    it('has role="status" for screen readers', () => {
        render(<Spinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has an accessible label', () => {
        render(<Spinner />);
        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('has displayName set to Spinner', () => {
        expect(Spinner.displayName).toBe('Spinner');
    });
});
