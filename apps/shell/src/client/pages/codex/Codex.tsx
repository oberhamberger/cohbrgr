import { FunctionComponent } from 'react';

import ApiNavigation from 'src/client/components/api-navigation';
import * as styles from 'src/client/pages/codex/Codex.module.scss';

/**
 * States what the architecture is for: a foundation sized for enterprise
 * applications, of which this site is the smallest possible demonstration.
 * Rendered by the shell rather than the content remote, so it stays reachable
 * when the remote is unhealthy.
 */
const Codex: FunctionComponent = () => {
    return (
        <>
            <main>
                <article className={styles.codex}>
                    <header>
                        <p role="doc-subtitle">C·V·Q·O</p>
                        <h1>Codex Visioque</h1>
                    </header>

                    <p className={styles.lede}>
                        A reference architecture for front-end applications that
                        outgrow one team.
                    </p>
                    <p>
                        The page is assembled at request time. A host renders on
                        the server and pulls in front-ends that were built and
                        deployed separately, so one team releases without
                        waiting on another’s build.
                    </p>
                    <p>
                        There is a data service because real applications query
                        data from somewhere, and that path has to exist before
                        anything is built on top of it. What it returns is
                        fetched during the same render and reaches the browser
                        with the HTML.
                    </p>
                    <p>
                        The pieces that have to stay consistent are shared:
                        colour tokens, server middleware, the localisation
                        contract. Nx rebuilds only what changed, and each piece
                        ships as its own container.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
