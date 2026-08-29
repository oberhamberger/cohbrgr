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
                        outgrow one team. Three services deploy independently
                        and are composed into a single server-rendered page
                        while the request is still open.
                    </p>
                    <dl>
                        <dt>Shell</dt>
                        <dd>
                            Express streams the HTML and React takes over in the
                            browser. Remotes are named in config, so the host
                            never needs to know what they contain.
                        </dd>
                        <dt>Content</dt>
                        <dd>
                            A remote, pulled in over Module Federation while the
                            server is still rendering. Its team releases without
                            a shell rebuild.
                        </dd>
                        <dt>API</dt>
                        <dd>
                            Copy and navigation as data. The front end is never
                            rebuilt to change either, and nothing in it depends
                            on where the data comes from.
                        </dd>
                    </dl>
                    <p>
                        Everything that has to stay consistent lives in one
                        place: the colour tokens, the Express middleware, the
                        localisation contract. Nx rebuilds only what changed,
                        and each app ships as its own container.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
