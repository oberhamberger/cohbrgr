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
                        This site is one page. Almost nothing here is needed to
                        serve it. The structure is built for the other case:
                        applications that grow to hundreds of screens and
                        several teams, where a foundation laid badly gets
                        expensive to replace as soon as anything depends on it.
                    </p>
                    <dl>
                        <dt>Shell</dt>
                        <dd>
                            Renders React on the server and composes whatever
                            remotes the page asks for. Adding a micro-frontend
                            is a config entry.
                        </dd>
                        <dt>Content</dt>
                        <dd>
                            A remote, loaded over Module Federation while the
                            request is still open. Its team deploys without the
                            shell being rebuilt.
                        </dd>
                        <dt>API</dt>
                        <dd>
                            Serves the copy and the navigation as data, so
                            changing either takes no build at all.
                        </dd>
                    </dl>
                    <p>
                        Nx caches the build graph so an unchanged package never
                        compiles twice. Design tokens are generated from Figma.
                        Each app ships as its own container to Cloud Run.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
