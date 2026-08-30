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
                {/* The expansion is appended rather than set as an aria-label:
                    overriding the name fails WCAG 2.5.3, which requires it to
                    contain the text a speech-input user can see. */}
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
            {/* No nodes means the API is unreachable. Render no landmark
                rather than an empty one a screen reader still announces. */}
            {navigationNodes.length > 0 && (
                <Navigation>
                    {/* Plain anchors even for internal paths — the remote has
                        no access to the host's router context. */}
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
