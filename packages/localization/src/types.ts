/**
 * Union type of all available translation keys.
 * Based on apps/api/data/translations.json
 */
export type TranslationKey =
    | 'hero.subtitle'
    | 'hero.title'
    | 'hero.text'
    | 'hero.nav.github'
    | 'hero.nav.bluesky'
    | 'hero.nav.linkedin'
    | 'offline.nav.refresh'
    | 'offline.nav.back';

/**
 * Map of translation keys to their translated string values.
 */
export type TranslationKeys = Record<TranslationKey, string>;

/**
 * Response shape from the language-specific translation API endpoint.
 * GET /translation/:lang
 */
export type TranslationResponse = {
    lang: string;
    keys: TranslationKeys;
};
