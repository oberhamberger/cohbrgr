import { FunctionComponent, ReactElement, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { TranslationProvider } from 'src/client/contexts/translation';
import { translationQueryOptions } from 'src/client/queries/translation';
import { TranslationKeys } from 'src/client/types/translation';

interface ITranslationLoader {
    children: ReactElement;
    fallback: {
        lang: string;
        keys: TranslationKeys;
    };
}

/**
 * Component that fetches translations from the API and provides them via context.
 * Uses fallback translations until the API response is received.
 */
const TranslationLoader: FunctionComponent<ITranslationLoader> = ({
    children,
    fallback,
}) => {
    const [translations, setTranslations] = useState(fallback);
    const { data } = useQuery(translationQueryOptions('en'));

    useEffect(() => {
        if (data) {
            setTranslations({ lang: data.lang, keys: data.keys });
        }
    }, [data]);

    return (
        <TranslationProvider context={translations}>{children}</TranslationProvider>
    );
};

TranslationLoader.displayName = 'TranslationLoader';

export default TranslationLoader;
