import { FunctionComponent } from 'react';

import { TranslationKey } from './types';
import { useTranslation } from './useTranslation';

export interface IMessage {
    /** The translation key to look up */
    id: TranslationKey;
    /** If true, renders HTML content (use with caution) */
    html?: boolean;
}

/**
 * Component that renders a translated message based on a translation key.
 * If the translation key is not found, displays the key in square brackets.
 */
const Message: FunctionComponent<IMessage> = ({ id, html = false }) => {
    const { translate } = useTranslation();
    const translation = translate(id);
    // If translation equals the key, it means no translation was found
    const isMissing = translation === id;
    const output = isMissing ? `[${id}]` : translation;

    if (html) {
        return <span dangerouslySetInnerHTML={{ __html: output }} />;
    }

    return <>{output}</>;
};

Message.displayName = 'Message';

export default Message;
