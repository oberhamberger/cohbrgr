/**
 * Union type of all available translation keys.
 * Based on apps/api/data/translations.json
 */
export type TranslationKey =
    | 'hero.subtitle'
    | 'hero.subtitle.label'
    | 'hero.title'
    | 'hero.text'
    | 'hero.nav.github'
    | 'hero.nav.bluesky'
    | 'hero.nav.linkedin'
    | 'codex.subtitle'
    | 'codex.title'
    | 'codex.lede'
    | 'codex.rendering'
    | 'codex.foundations'
    | 'codex.nav.home'
    | 'codex.nav.source'
    | 'notfound.nav.back'
    | 'offline.nav.refresh'
    | 'offline.nav.back';

/**
 * Map of translation keys to their translated string values.
 * Partial because translations may not be loaded yet.
 */
export type TranslationKeys = Partial<Record<TranslationKey, string>>;

/**
 * Response shape from the language-specific translation API endpoint.
 * GET /translation/:lang
 */
export type TranslationResponse = {
    lang: string;
    keys: TranslationKeys;
};

/**
 * A single navigation entry as served by the API. The label is a translation
 * key rather than a string, so navigation data stays language-agnostic.
 * Mirrors the shape produced by apps/api/data/navigation.json.
 */
export type NavigationNode = {
    id: string;
    labelKey: TranslationKey;
    path: string;
    /** True when `path` leaves the site, so the host must not route it. */
    external?: boolean;
};

/**
 * Response shape from the per-node navigation endpoint.
 * GET /navigation/:nodeId
 */
export type NavigationResponse = NavigationNode[];

/**
 * Response shape from the full navigation endpoint.
 * GET /navigation
 */
export type NavigationData = Record<string, { nodes: NavigationNode[] }>;
