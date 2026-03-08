import { FunctionComponent } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Navigation } from '@cohbrgr/components';
import { Message, TranslationProvider } from '@cohbrgr/localization';

import { translationQueryOptions } from 'src/client/queries/translation';

import StructuredData from '../structured-data';

export interface IContent {
    nonce?: string | undefined;
}

/**
 * Main content component displaying the hero section with translated text.
 * Fetches translations using TanStack Query and provides them via context.
 */
const Content: FunctionComponent<IContent> = ({ nonce }) => {
    const { data: translations } = useSuspenseQuery(
        translationQueryOptions('en'),
    );

    return (
        <TranslationProvider context={translations}>
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
        </TranslationProvider>
    );
};

Content.displayName = 'Content';

export default Content;
