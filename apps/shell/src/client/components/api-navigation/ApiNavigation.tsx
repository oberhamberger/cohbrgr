import { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Navigation } from '@cohbrgr/components';
import { Message, TranslationProvider } from '@cohbrgr/localization';

import { navigationQueryOptions } from 'src/client/queries/navigation';
import { translationQueryOptions } from 'src/client/queries/translation';

interface IApiNavigation {
    /** Key of the navigation tree in the API, e.g. `codex` or `not-found`. */
    nodeId: string;
    /** Rendered when the API returns nothing, so a page is never a dead end. */
    fallback?: ReactNode;
}

// Shell-side, so internal paths can be router links; external ones are anchors.
const ApiNavigation: FunctionComponent<IApiNavigation> = ({
    nodeId,
    fallback,
}) => {
    const { data: translations } = useSuspenseQuery(
        translationQueryOptions('en'),
    );
    const { data: nodes } = useSuspenseQuery(navigationQueryOptions(nodeId));

    if (nodes.length === 0) {
        return fallback ? <Navigation>{fallback}</Navigation> : null;
    }

    return (
        <TranslationProvider context={translations}>
            <Navigation>
                {nodes.map((node) =>
                    node.external ? (
                        <a
                            key={node.id}
                            href={node.path}
                            rel="noopener noreferrer"
                        >
                            <Message id={node.labelKey} />
                        </a>
                    ) : (
                        <Link key={node.id} to={node.path}>
                            <Message id={node.labelKey} />
                        </Link>
                    ),
                )}
            </Navigation>
        </TranslationProvider>
    );
};

ApiNavigation.displayName = 'ApiNavigation';

export default ApiNavigation;
