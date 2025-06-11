import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Spinner from 'src/spinner';

describe('Spinner component', () => {
    it('displays spinner', async () => {
        render(<Spinner />);
        const items = await screen.findAllByTestId('spinner');
        expect(items).toHaveLength(1);
    });
});
