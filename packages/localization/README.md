# @cohbrgr/localization

This package provides internationalization (i18n) utilities for React applications, including translation context, hooks, and components.

## Installation

```bash
pnpm add @cohbrgr/localization
```

## Exports

| Export                   | Type      | Description                          |
| ------------------------ | --------- | ------------------------------------ |
| `TranslationProvider`    | Component | Context provider for translations    |
| `TranslationContext`     | Context   | React context for translation values |
| `useTranslation`         | Hook      | Access translation context           |
| `Message`                | Component | Render translated text by key        |
| `TranslationKey`         | Type      | Union of all valid translation keys  |
| `TranslationKeys`        | Type      | Record mapping keys to strings       |
| `TranslationResponse`    | Type      | API response shape for translations  |
| `TranslationContextValue`| Type      | Shape of the translation context     |

## Quick Start

```tsx
import { TranslationProvider, Message, useTranslation } from '@cohbrgr/localization';

// Wrap your app with the provider
const App = () => {
    const translations = { lang: 'en', keys: { 'hello': 'Hello World' } };

    return (
        <TranslationProvider context={translations}>
            <h1><Message id="hello" /></h1>
        </TranslationProvider>
    );
};
```

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

## Components

### `TranslationProvider`

Context provider that makes translations available to the component tree.

**Props:**

| Prop       | Type                                      | Description      |
| ---------- | ----------------------------------------- | ---------------- |
| `children` | `ReactNode`                               | Child components |
| `context`  | `{ lang: string; keys: TranslationKeys }` | Translation data |

```tsx
import { TranslationProvider } from '@cohbrgr/localization';

const translations = {
    lang: 'en',
    keys: { 'hero.title': 'Hello World' },
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

When a translation key is not found, the Message component displays the key wrapped in square brackets `[key]`. This makes it easy to identify missing translations during development.

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

## Usage with TanStack Query (Recommended)

For SSR applications, use TanStack Query's `useSuspenseQuery` to fetch translations:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { TranslationProvider, Message } from '@cohbrgr/localization';

const translationQueryOptions = (lang: string) => ({
    queryKey: ['translations', lang],
    queryFn: () => fetch(`/api/translation/${lang}`).then(r => r.json()),
    staleTime: 1000 * 60 * 60, // 1 hour
});

const Content = () => {
    const { data: translations } = useSuspenseQuery(translationQueryOptions('en'));

    return (
        <TranslationProvider context={translations}>
            <h1><Message id="hero.title" /></h1>
        </TranslationProvider>
    );
};
```

This approach:
- Works with React Suspense for loading states
- Supports SSR with proper hydration via TanStack Query's `dehydrate`/`HydrationBoundary`
- Caches translations to avoid unnecessary refetches

## Missing Translation Behavior

| Scenario                | `translate()` returns | `<Message>` displays |
| ----------------------- | --------------------- | -------------------- |
| Translation found       | `"Translated text"`   | `Translated text`    |
| Translation key missing | `"missing.key"`       | `[missing.key]`      |

The bracket notation makes missing translations easy to spot during development while keeping the app functional.
