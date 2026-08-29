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
                        This is a reference micro-frontend architecture for
                        enterprise applications that eventually outgrow one
                        team.
                    </p>
                    <p>
                        The entire page is server-side rendered, including its
                        federated parts that were built and deployed separately.
                    </p>
                    <p>
                        The pieces that have to stay consistent across teams are
                        shared: colour tokens, server middleware, the
                        localisation contract and other technical foundations
                        like React, TypeScript and the build process.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
