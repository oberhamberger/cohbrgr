import { FunctionComponent } from 'react';

import ApiNavigation from 'src/client/components/api-navigation';
import * as styles from 'src/client/pages/codex/Codex.module.scss';

/**
 * Explains what this repository is and how it is put together. Rendered by the
 * shell rather than the content remote, so it stays reachable when the remote
 * is unhealthy.
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
                        The front page of this site is two sentences long.
                        Everything underneath it is the actual project.
                    </p>
                    <p>
                        cohbrgr is a TypeScript monorepo built to find out how
                        far server-rendered React gets when no framework is
                        doing the work for you. There is no create-react-app
                        here and no Next.js. Rendering, routing, bundling and
                        deployment are all assembled by hand.
                    </p>

                    <h2>Three applications</h2>
                    <p>
                        The page you came from is composed at request time out
                        of three applications that deploy separately.
                    </p>
                    <dl>
                        <dt>Shell</dt>
                        <dd>
                            The host. An Express server renders React to HTML,
                            streams it out, and the browser hydrates it.
                        </dd>
                        <dt>Content</dt>
                        <dd>
                            A remote micro-frontend exposing a single component.
                            The shell pulls it in over Module Federation while
                            the request is still open, on the server as well as
                            in the browser.
                        </dd>
                        <dt>API</dt>
                        <dd>
                            A small Express service holding the translations.
                        </dd>
                    </dl>
                    <p>
                        When the content app is unreachable the shell notices
                        before it renders, and the page still comes back as HTML
                        instead of an error.
                    </p>

                    <h2>How it is built</h2>
                    <p>
                        Rspack does the bundling and Nx orchestrates the build
                        graph, caching each task so an unchanged package is
                        never rebuilt twice. pnpm workspaces hold it together,
                        and a handful of internal packages carry whatever more
                        than one app needs: the build configuration, the Express
                        middleware, the design tokens you are looking at, the
                        localisation.
                    </p>
                    <p>
                        Versions follow CalVer, one shared number across every
                        package. Deployment is three containers pushed to Google
                        Cloud Run in parallel, with smoke tests run against
                        production afterwards.
                    </p>

                    <h2>Why</h2>
                    <p>
                        A framework answers these questions before you have
                        thought to ask them, and the answers then live inside
                        the abstraction where you cannot see them. Assembling it
                        by hand keeps them in the repository, readable and
                        changeable. It is a slow way to build a personal site
                        and a fast way to learn what the tooling has been doing
                        on your behalf.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
