import { FunctionComponent } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Navigation } from '@cohbrgr/components';
import { Message, TranslationProvider } from '@cohbrgr/localization';

import { navigationQueryOptions } from 'src/client/queries/navigation';
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
    const { data: navigationNodes } = useSuspenseQuery(
        navigationQueryOptions('hero'),
    );

    return (
        <TranslationProvider context={translations}>
            <main>
                {/* The mark is the way into the codex and carries no link
                    styling, so the expansion is appended for assistive tech
                    rather than replacing the name with aria-label. Overriding
                    it fails WCAG 2.5.3: the accessible name has to contain the
                    text a speech-input user can actually see. */}
                <p role="doc-subtitle">
                    <a href="/codex">
                        <Message id="hero.subtitle" />
                        <span className="sr-only">
                            {' — '}
                            <Message id="hero.subtitle.label" />
                        </span>
                    </a>
                </p>
                <h1>
                    <Message id="hero.title" html />
                </h1>
                <p>
                    <Message id="hero.text" html />
                </p>
            </main>
            {/* No nodes means the API is unreachable. Render no landmark at
                all rather than an empty one a screen reader still announces. */}
            {navigationNodes.length > 0 && (
                <Navigation>
                    {/* Plain anchors even for internal paths: this is the
                        remote, and reaching for the host's router would couple
                        it to a context it cannot provide on its own. */}
                    {navigationNodes.map((node) => (
                        <a
                            key={node.id}
                            href={node.path}
                            {...(node.external && {
                                rel: 'noopener noreferrer',
                            })}
                        >
                            <Message id={node.labelKey} />
                        </a>
                    ))}
                </Navigation>
            )}
            <StructuredData nonce={nonce} />
        </TranslationProvider>
    );
};

Content.displayName = 'Content';

export default Content;
