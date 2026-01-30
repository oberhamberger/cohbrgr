import { FunctionComponent } from 'react';

import { useTranslation } from 'src/client/hooks/useTranslation';
import { TranslationKey } from 'src/client/types/translation';

export interface IMessage {
    /** The translation key to look up */
    id: TranslationKey;
    /** Optional fallback text if key not found */
    fallback?: string;
    /** If true, renders HTML content (use with caution) */
    html?: boolean;
}

const isDevelopment = process.env['NODE_ENV'] !== 'production';

/**
 * Component that renders a translated message based on a translation key.
 * In development, fallback/default translations are wrapped with square brackets.
 */
const Message: FunctionComponent<IMessage> = ({ id, fallback, html = false }) => {
    const { translate, isDefault } = useTranslation();
    const translation = translate(id);
    // If translation equals the key, it means no translation was found
    const isFallback = translation === id;
    const translated = isFallback ? fallback || id : translation;

    // Mark fallback/default translations with brackets in development
    const shouldMark = isDevelopment && (isDefault || isFallback);
    const output = shouldMark ? `[${translated}]` : translated;

    if (html) {
        return <span dangerouslySetInnerHTML={{ __html: output }} />;
    }

    return <>{output}</>;
};

Message.displayName = 'Message';

export default Message;
