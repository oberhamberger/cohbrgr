import { FunctionComponent, ReactElement, useEffect, useState } from 'react';

import { TranslationKeys, TranslationProvider } from '@cohbrgr/localization';
import { useQuery } from '@tanstack/react-query';
import { translationQueryOptions } from 'src/client/queries/translation';

interface ITranslationLoader {
    children: ReactElement;
    fallback: {
        lang: string;
        keys: TranslationKeys;
    };
}

type TranslationState = {
    lang: string;
    keys: TranslationKeys;
    isDefault: boolean;
};

/**
 * Component that fetches translations from the API and provides them via context.
 * Uses fallback translations until the API response is received.
 */
const TranslationLoader: FunctionComponent<ITranslationLoader> = ({
    children,
    fallback,
}) => {
    const [translations, setTranslations] = useState<TranslationState>({
        ...fallback,
        isDefault: true,
    });
    const { data } = useQuery(translationQueryOptions('en'));

    useEffect(() => {
        if (data) {
            setTranslations({ lang: data.lang, keys: data.keys, isDefault: false });
        }
    }, [data]);

    return (
        <TranslationProvider context={translations}>{children}</TranslationProvider>
    );
};

TranslationLoader.displayName = 'TranslationLoader';

export default TranslationLoader;
