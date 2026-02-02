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
       ▲
       │ fetch (awaited before React render)
       │
┌──────┴──────────────────────────────────────────────────┐
│                       Shell App                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ render.tsx (Pre-fetch + Suspense SSR)               ││
│  │  1. Fetch translations (awaited)                    ││
│  │  2. Create cache with pre-fetched data              ││
│  │  3. Single-pass render with renderToPipeableStream  ││
│  └─────────────────────────────────────────────────────┘│
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────┐  ┌────────────────────────┐   │
│  │TranslationCacheProvider│─▶│SuspenseTranslationLoader│  │
│  │ (Suspense-compatible │  │  (reads from cache,    │   │
│  │  translation cache)  │  │   provides context)    │   │
│  └──────────────────────┘  │  ┌────────┐  ┌──────┐  │   │
│         │                  │  │Message │  │useT..│  │   │
│         ▼                  │  └────────┘  └──────┘  │   │
│  ┌─────────────────┐       └────────────────────────┘   │
│  │ __initial_state_│                                    │
│  │ (hydration)     │                                    │
│  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

The shell app uses a pre-fetch + Suspense approach:

1. **Pre-fetch**: Translations are fetched and awaited before React starts rendering
2. **Cache**: A Suspense-compatible cache is created with the pre-fetched data
3. **Render**: Single-pass `renderToPipeableStream` with cache already populated
4. **Hydration**: Client receives translations via `__initial_state__` and uses the same cache structure

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

## API Endpoints

The API provides two endpoints for translations:

| Endpoint                 | Description                                  |
| ------------------------ | -------------------------------------------- |
| `GET /translation`       | Returns all translations (all languages)     |
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

The shell app pre-fetches translations before React rendering, then uses a Suspense-compatible cache for both SSR and hydration.

### Render Middleware

In `apps/shell/src/server/middleware/render.tsx`:

```tsx
import { createTranslationCache } from '@cohbrgr/localization';
import { fetchTranslations } from 'src/client/queries/translation';

const render = (isProduction, useClientSideRendering) => async (req, res) => {
    // Fetch translations before React render
    let translationData;
    try {
        translationData = await fetchTranslations('en');
    } catch (error) {
        translationData = { lang: 'en', keys: {} };
    }

    // Create cache with pre-fetched data - no Suspense needed during render
    const translationCache = createTranslationCache(undefined, translationData);

    // Single-pass render with cache already populated
    renderToPipeableStream(
        <Index translationCache={translationCache} /* ... */ />,
        {
            onAllReady() {
                // Stream complete HTML
            },
        },
    );
};
```

### SSR Template

In `apps/shell/src/server/template/Index.html.tsx`:

```tsx
import {
    TranslationCacheProvider,
    SuspenseTranslationLoader,
} from '@cohbrgr/localization';

<TranslationCacheProvider cache={props.translationCache}>
    <AppStateProvider context={/* ... */}>
        <Suspense fallback={null}>
            <SuspenseTranslationLoader>
                <App />
            </SuspenseTranslationLoader>
        </Suspense>
    </AppStateProvider>
</TranslationCacheProvider>;

{
    /* Translations from cache embedded in initial state */
}
<Javascript translationCache={props.translationCache} /* ... */ />;
```

### Client Bootstrap

In `apps/shell/src/client/bootstrap.tsx`, the client uses the same component structure with a pre-populated cache:

```tsx
import {
    createTranslationCache,
    TranslationCacheProvider,
    SuspenseTranslationLoader,
} from '@cohbrgr/localization';

const translations = window.__initial_state__?.translations ?? {};

// Create cache pre-populated with SSR translations for hydration
const translationCache = createTranslationCache(undefined, {
    lang: 'en',
    keys: translations,
});

hydrateRoot(
    root,
    <TranslationCacheProvider cache={translationCache}>
        <AppStateProvider context={window.__initial_state__}>
            <Suspense fallback={null}>
                <SuspenseTranslationLoader>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SuspenseTranslationLoader>
            </Suspense>
        </AppStateProvider>
    </TranslationCacheProvider>,
);
```

This ensures SSR and client hydration use identical component trees and translations, preventing hydration mismatches.

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
    const [translations, setTranslations] = useState(fallback);
    const { data } = useQuery(translationQueryOptions('en'));

    useEffect(() => {
        if (data) {
            setTranslations({
                lang: data.lang,
                keys: data.keys,
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
<TranslationLoader fallback={{ lang: 'en', keys: {} }}>
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
        <h1>
            <Message id="hero.title" />
        </h1>
        <p>
            <Message id="hero.text" html />
        </p>
    </main>
);
```

### useTranslation Hook

For more control or computed translations:

```tsx
import { useTranslation } from '@cohbrgr/localization';

const Navigation = () => {
    const { translate } = useTranslation();

    return (
        <nav>
            <a href="/github">{translate('hero.nav.github')}</a>
        </nav>
    );
};
```

## Missing Translation Behavior

The `Message` component displays missing translation keys wrapped in square brackets:

| Condition               | Display                          |
| ----------------------- | -------------------------------- |
| Translation found       | `Translation text`               |
| Missing translation key | `[key.name]`                     |

This makes it easy to identify content that needs translation.

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

5. **Graceful degradation** - The app renders translation keys in brackets if the API fails, making it functional but clearly indicating missing translations
