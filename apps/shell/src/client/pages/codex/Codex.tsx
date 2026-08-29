import { FunctionComponent } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Message, TranslationProvider } from '@cohbrgr/localization';

import ApiNavigation from 'src/client/components/api-navigation';
import * as styles from 'src/client/pages/codex/Codex.module.scss';
import { translationQueryOptions } from 'src/client/queries/translation';

/**
 * States what the architecture is for: a foundation sized for enterprise
 * applications, of which this site is the smallest possible demonstration.
 * Rendered by the shell rather than the content remote, so it stays reachable
 * when the remote is unhealthy.
 */
const Codex: FunctionComponent = () => {
    const { data: translations } = useSuspenseQuery(
        translationQueryOptions('en'),
    );

    return (
        <TranslationProvider context={translations}>
            <main>
                <article className={styles.codex}>
                    <header>
                        <p role="doc-subtitle">
                            <Message id="codex.subtitle" />
                        </p>
                        <h1>
                            <Message id="codex.title" />
                        </h1>
                    </header>

                    <p className={styles.lede}>
                        <Message id="codex.lede" />
                    </p>
                    <p>
                        <Message id="codex.rendering" />
                    </p>
                    <p>
                        <Message id="codex.foundations" />
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </TranslationProvider>
    );
};

Codex.displayName = 'Codex';

export default Codex;
