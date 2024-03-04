import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Content from 'src/client/components/content/Content';

const nonce = '123456789';

describe('Main Content Component', () => {
    it('displays greeting', async () => {
        render(<Content nonce={nonce}/>);
        const items = await screen.findAllByText('Hi!');
        expect(items).toHaveLength(1);
    });

    it('displays navigation', async () => {
        const { container } = render(<Content nonce={nonce}/>);
        expect(container.getElementsByTagName('nav').length).toEqual(1);
        expect(container.getElementsByTagName('li').length).toEqual(3);
    });
});
