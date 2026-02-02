# @cohbrgr/localization

This package provides internationalization (i18n) utilities for React applications, including translation context, hooks, components, and Suspense-compatible SSR support.

## Installation

```bash
pnpm add @cohbrgr/localization
```

## Exports

| Export                      | Type      | Description                                  |
| --------------------------- | --------- | -------------------------------------------- |
| `TranslationProvider`       | Component | Context provider for translations            |
| `TranslationContext`        | Context   | React context for translation values         |
| `useTranslation`            | Hook      | Access translation context                   |
| `Message`                   | Component | Render translated text by key                |
| `createTranslationCache`    | Function  | Create Suspense-compatible translation cache |
| `TranslationCacheProvider`  | Component | Provider for translation cache               |
| `SuspenseTranslationLoader` | Component | Suspense-aware translation loader            |
| `TranslationKey`            | Type      | Union of all valid translation keys          |
| `TranslationKeys`           | Type      | Record mapping keys to translated strings    |
| `TranslationResponse`       | Type      | API response shape for translations          |
| `TranslationContextValue`   | Type      | Shape of the translation context value       |
| `TranslationCache`          | Type      | Shape of the Suspense-compatible cache       |

## Types

### `TranslationKey`

Union type of all available translation keys based on `apps/api/data/translations.json`.

```typescript
type TranslationKey =
    | 'hero.subtitle'
    | 'hero.title'
    | 'hero.text'
    | 'hero.nav.github'
    | 'hero.nav.bluesky'
    | 'hero.nav.linkedin'
    | 'offline.nav.refresh'
    | 'offline.nav.back';
```

### `TranslationKeys`

Map of translation keys to their translated string values.

```typescript
type TranslationKeys = Record<TranslationKey, string>;
```

### `TranslationResponse`

Response shape from the translation API endpoint.

```typescript
type TranslationResponse = {
    lang: string;
    keys: TranslationKeys;
};
```

### `TranslationCache`

Suspense-compatible cache for translations.

```typescript
type TranslationCache = {
    read: () => TranslationResponse; // Suspends if not resolved
    getResolved: () => TranslationResponse | undefined; // Non-suspending
};
```

## Suspense-Compatible SSR

For SSR with proper hydration, use the Suspense-compatible cache system.

### `createTranslationCache`

Creates a Suspense-compatible translation cache.

```typescript
function createTranslationCache(
    fetcher?: () => Promise<TranslationResponse>,
    initialData?: TranslationResponse,
): TranslationCache;
```

**Parameters:**

| Parameter     | Type                                 | Description                          |
| ------------- | ------------------------------------ | ------------------------------------ |
| `fetcher`     | `() => Promise<TranslationResponse>` | Function to fetch translations (SSR) |
| `initialData` | `TranslationResponse`                | Pre-populated data (hydration)       |

**SSR Usage (pre-fetch before render):**

```tsx
// Fetch before React render
const translationData = await fetchTranslations('en');

// Create cache with pre-fetched data
const cache = createTranslationCache(undefined, translationData);
```

**Client Hydration Usage:**

```tsx
const translations = window.__initial_state__?.translations ?? {};

// Create cache pre-populated with SSR data
const cache = createTranslationCache(undefined, {
    lang: 'en',
    keys: translations,
});
```

### `TranslationCacheProvider`

Provider component for the translation cache.

```tsx
import { TranslationCacheProvider } from '@cohbrgr/localization';

<TranslationCacheProvider cache={translationCache}>
    <App />
</TranslationCacheProvider>;
```

### `SuspenseTranslationLoader`

Component that reads translations from the cache and provides them via context. Must be wrapped in a `<Suspense>` boundary.

```tsx
import {
    TranslationCacheProvider,
    SuspenseTranslationLoader,
} from '@cohbrgr/localization';

<TranslationCacheProvider cache={translationCache}>
    <Suspense fallback={<Loading />}>
        <SuspenseTranslationLoader>
            <App />
        </SuspenseTranslationLoader>
    </Suspense>
</TranslationCacheProvider>;
```

### Complete SSR Example

**Server (render middleware):**

```tsx
import { createTranslationCache } from '@cohbrgr/localization';

const render = async (req, res) => {
    // Pre-fetch translations
    const translationData = await fetchTranslations('en');

    // Create cache with pre-fetched data
    const translationCache = createTranslationCache(undefined, translationData);

    renderToPipeableStream(
        <TranslationCacheProvider cache={translationCache}>
            <Suspense fallback={null}>
                <SuspenseTranslationLoader>
                    <App />
                </SuspenseTranslationLoader>
            </Suspense>
        </TranslationCacheProvider>,
        {
            onAllReady() {
                /* stream response */
            },
        },
    );
};
```

**Client (bootstrap):**

```tsx
import {
    createTranslationCache,
    TranslationCacheProvider,
    SuspenseTranslationLoader,
} from '@cohbrgr/localization';

const translations = window.__initial_state__?.translations ?? {};

const translationCache = createTranslationCache(undefined, {
    lang: 'en',
    keys: translations,
});

hydrateRoot(
    root,
    <TranslationCacheProvider cache={translationCache}>
        <Suspense fallback={null}>
            <SuspenseTranslationLoader>
                <App />
            </SuspenseTranslationLoader>
        </Suspense>
    </TranslationCacheProvider>,
);
```

## Components

### `TranslationProvider`

Context provider that makes translations available to the component tree. Use this for simple client-side apps without SSR.

**Props:**

| Prop       | Type                                     | Description      |
| ---------- | ---------------------------------------- | ---------------- |
| `children` | `ReactElement`                           | Child components |
| `context`  | `{ lang: string; keys: TranslationKeys }` | Translation data |

```tsx
import { TranslationProvider } from '@cohbrgr/localization';

const translations = {
    lang: 'en',
    keys: { 'hero.title': 'Hello World' /* ... */ },
};

<TranslationProvider context={translations}>
    <App />
</TranslationProvider>;
```

### `Message`

Component that renders translated text based on a translation key.

**Props:**

| Prop   | Type             | Default | Description                               |
| ------ | ---------------- | ------- | ----------------------------------------- |
| `id`   | `TranslationKey` | -       | The translation key to look up            |
| `html` | `boolean`        | `false` | Render content as HTML (use with caution) |

**Missing Translation Behavior:**

When a translation key is not found, the Message component displays the key wrapped in square brackets `[key]`. This makes it easy to identify missing translations.

```tsx
import { Message } from '@cohbrgr/localization';

// Basic usage
<h1><Message id="hero.title" /></h1>

// Render HTML content
<p><Message id="hero.text" html /></p>

// Missing key displays: [missing.key]
<p><Message id="missing.key" /></p>
```

## Hook

### `useTranslation`

Hook to access translation context values.

**Returns:** `TranslationContextValue`

| Property    | Type                              | Description                     |
| ----------- | --------------------------------- | ------------------------------- |
| `lang`      | `string`                          | Current language code           |
| `keys`      | `TranslationKeys`                 | All translation key-value pairs |
| `translate` | `(key: TranslationKey) => string` | Get translation for a key       |

```tsx
import { useTranslation } from '@cohbrgr/localization';

const MyComponent = () => {
    const { translate, lang } = useTranslation();

    return (
        <div>
            <p>Language: {lang}</p>
            <p>{translate('hero.title')}</p>
        </div>
    );
};
```

## Missing Translation Behavior

When a translation key is not found, it is returned as-is from `translate()`. The `Message` component wraps missing keys in brackets `[key]` to make them easy to identify.
