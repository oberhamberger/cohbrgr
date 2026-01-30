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

/**
 * Component that renders a translated message based on a translation key.
 */
const Message: FunctionComponent<IMessage> = ({ id, fallback, html = false }) => {
    const { translate } = useTranslation();
    const translation = translate(id);
    // If translation equals the key, it means no translation was found
    const translated = translation === id ? fallback || id : translation;

    if (html) {
        return <span dangerouslySetInnerHTML={{ __html: translated }} />;
    }

    return <>{translated}</>;
};

Message.displayName = 'Message';

export default Message;
