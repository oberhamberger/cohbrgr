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
                        This site runs on a foundation meant for enterprise
                        applications. One page is what it happens to serve. The
                        structure underneath assumes many more, built by teams
                        that ship on their own schedule.
                    </p>
                    <dl>
                        <dt>Shell</dt>
                        <dd>
                            The host. Renders on the server and composes
                            whatever the remotes hand it, so adding one is a
                            configuration entry.
                        </dd>
                        <dt>Content</dt>
                        <dd>
                            A remote, federated at runtime. Its team deploys
                            without waiting for the shell.
                        </dd>
                        <dt>API</dt>
                        <dd>
                            Copy and navigation live here instead of in a build,
                            so changing either is a data change.
                        </dd>
                    </dl>
                    <p>
                        Nx keeps the build fast as the graph grows. Design
                        tokens come out of Figma, and every app ships as its own
                        container to Cloud Run.
                    </p>
                    <p>
                        At this size none of it is necessary. It is here so it
                        does not have to be retrofitted later.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
