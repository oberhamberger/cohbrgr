import { FunctionComponent } from 'react';

import { Navigation } from '@cohbrgr/components';

import { Message } from '../message';
import StructuredData from '../structured-data';

export interface IContent {
    nonce?: string | undefined;
}

/**
 * Main content component displaying the hero section with translated text.
 */
const Content: FunctionComponent<IContent> = ({ nonce }) => {
    return (
        <>
            <main>
                <h1>
                    <Message id="hero.title" />
                </h1>
                <p>
                    <Message id="hero.text" html />
                </p>
            </main>
            <Navigation>
                <a href="https://github.com/oberhamberger">
                    <Message id="hero.nav.github" />
                </a>
                <a href="https://bsky.app/profile/cohbrgr.bsky.social">
                    <Message id="hero.nav.bluesky" />
                </a>
                <a href="https://www.linkedin.com/in/oberhamberger">
                    <Message id="hero.nav.linkedin" />
                </a>
            </Navigation>
            <StructuredData nonce={nonce} />
        </>
    );
};

Content.displayName = 'Content';

export default Content;
