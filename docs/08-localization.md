# Localization

This document describes how internationalization (i18n) is implemented across the cohbrgr applications.

## Overview

The localization system consists of three parts:

1. **Translation Data** - JSON file in the API containing translations for all supported languages
2. **Translation API** - REST endpoints to fetch translations
3. **Client Integration** - React context, hooks, and components from `@cohbrgr/localization`

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  API Server │────▶│  /translation│────▶│ translations.json│
└─────────────┘     └─────────────┘     └──────────────────┘
       │
       │ fetch (client-side)
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Shell / Content App                   │
│  ┌─────────────────┐    ┌────────────────────────────┐  │
│  │TranslationLoader│───▶│   TranslationProvider      │  │
│  │                 │    │                            │  │
│  └─────────────────┘    │  ┌────────┐  ┌──────────┐  │  │
│                         │  │Message │  │useTransl.│  │  │
│                         │  └────────┘  └──────────┘  │  │
│                         └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

Both shell and content apps fetch translations client-side using TanStack Query.

## Translation Data

Translations are stored in `apps/api/data/translations.json`:

```json
{
    "en": {
        "hero.title": "My Name is Christian.",
        "hero.text": "I am a Frontend Architect...",
        "hero.nav.github": "Github"
    },
    "de": {
        "hero.title": "Mein Name ist Christian.",
        "hero.text": "Ich bin Frontend-Architekt...",
        "hero.nav.github": "Github"
    }
}
```

### Adding New Keys

1. Add the key to all language objects in `translations.json`
2. Update the `TranslationKey` type in `packages/localization/src/types.ts`
3. Update `defaultTranslations` in `packages/localization/src/context.tsx`

## API Endpoints

The API provides two endpoints for translations:

| Endpoint             | Description                          |
| -------------------- | ------------------------------------ |
| `GET /translation`   | Returns all translations (all languages) |
| `GET /translation/:lang` | Returns translations for a specific language |

### Response Format

```json
{
    "lang": "en",
    "keys": {
        "hero.title": "My Name is Christian.",
        "hero.text": "..."
    }
}
```

## Shell App Integration

The shell app fetches translations client-side using TanStack Query, similar to the content app.

### Translation Query

In `apps/shell/src/client/queries/translation.ts`:

```typescript
import { TranslationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/shell/env';
import { queryOptions } from '@tanstack/react-query';

export const translationQueryOptions = (lang: string = 'en') =>
    queryOptions({
        queryKey: ['translations', lang],
        queryFn: () => fetchTranslations(lang),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
```

### Translation Loader Component

In `apps/shell/src/client/components/translation-loader/TranslationLoader.tsx`:

```tsx
import { TranslationProvider } from '@cohbrgr/localization';
import { useQuery } from '@tanstack/react-query';

const TranslationLoader = ({ children, fallback }) => {
    const [translations, setTranslations] = useState({
        ...fallback,
        isDefault: true,
    });
    const { data } = useQuery(translationQueryOptions('en'));

    useEffect(() => {
        if (data) {
            setTranslations({
                lang: data.lang,
                keys: data.keys,
                isDefault: false
            });
        }
    }, [data]);

    return (
        <TranslationProvider context={translations}>
            {children}
        </TranslationProvider>
    );
};
```

### SSR Template

In `apps/shell/src/server/template/Index.html.tsx`, default translations are used for SSR:

```tsx
import { defaultTranslations, TranslationProvider } from '@cohbrgr/localization';

<TranslationProvider
    context={{ lang: 'en', keys: defaultTranslations, isDefault: true }}
>
    <App />
</TranslationProvider>
```

### Client Bootstrap

In `apps/shell/src/client/bootstrap.tsx`:

```tsx
import { defaultTranslations } from '@cohbrgr/localization';
import { TranslationLoader } from 'src/client/components/translation-loader';

<TranslationLoader fallback={{ lang: 'en', keys: defaultTranslations }}>
    <App />
</TranslationLoader>
```

The client hydrates with default translations, then fetches updated translations from the API.

## Content App Integration

The content app fetches translations client-side using TanStack Query.

### Translation Query

In `apps/content/src/client/queries/translation.ts`:

```typescript
import { TranslationResponse } from '@cohbrgr/localization';
import { queryOptions } from '@tanstack/react-query';

export const translationQueryOptions = (lang: string = 'en') =>
    queryOptions({
        queryKey: ['translations', lang],
        queryFn: () => fetchTranslations(lang),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
```

### Translation Loader Component

In `apps/content/src/client/components/translation-loader/TranslationLoader.tsx`:

```tsx
import { TranslationProvider } from '@cohbrgr/localization';
import { useQuery } from '@tanstack/react-query';

const TranslationLoader = ({ children, fallback }) => {
    const [translations, setTranslations] = useState({
        ...fallback,
        isDefault: true,
    });
    const { data } = useQuery(translationQueryOptions('en'));

    useEffect(() => {
        if (data) {
            setTranslations({
                lang: data.lang,
                keys: data.keys,
                isDefault: false
            });
        }
    }, [data]);

    return (
        <TranslationProvider context={translations}>
            {children}
        </TranslationProvider>
    );
};
```

### Bootstrap

In `apps/content/src/client/bootstrap.tsx`:

```tsx
import { defaultTranslations } from '@cohbrgr/localization';

<TranslationLoader fallback={{ lang: 'en', keys: defaultTranslations }}>
    <App />
</TranslationLoader>
```

## Using Translations in Components

### Message Component

The simplest way to display translated text:

```tsx
import { Message } from '@cohbrgr/localization';

const Hero = () => (
    <main>
        <h1><Message id="hero.title" /></h1>
        <p><Message id="hero.text" html /></p>
    </main>
);
```

### useTranslation Hook

For more control or computed translations:

```tsx
import { useTranslation } from '@cohbrgr/localization';

const Navigation = () => {
    const { translate, isDefault } = useTranslation();

    return (
        <nav>
            <a href="/github">{translate('hero.nav.github')}</a>
            {isDefault && <Spinner />}
        </nav>
    );
};
```

## Development Mode

In development (`NODE_ENV !== 'production'`), the `Message` component adds visual indicators for untranslated content:

| Condition | Display |
| --------- | ------- |
| Using default translations | `[Translation text]` |
| Missing translation key | `[key.name]` or `[Fallback text]` |
| Loaded from API | `Translation text` (no brackets) |

This makes it easy to identify content that needs translation during development.

## Adding a New Language

1. Add the language object to `apps/api/data/translations.json`:

```json
{
    "en": { ... },
    "de": { ... },
    "fr": {
        "hero.title": "Je m'appelle Christian.",
        ...
    }
}
```

2. The API will automatically serve the new language at `/translation/fr`

3. Update the app to fetch the appropriate language based on user preference or browser settings

## Best Practices

1. **Use translation keys** that describe the content's purpose, not its value:
   - Good: `hero.title`, `nav.home`, `error.notFound`
   - Bad: `hello_text`, `button1`, `message`

2. **Keep translations in sync** - All languages should have the same keys

3. **Use the Message component** for most translations - it handles fallbacks and development indicators

4. **Cache translations** - Use appropriate stale times in TanStack Query to avoid unnecessary refetches

5. **Provide fallbacks** - Always have default translations so the app renders even if the API fails
