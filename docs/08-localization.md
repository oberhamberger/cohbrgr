# Localization

This document describes how internationalization (i18n) is implemented across the cohbrgr applications.

## Overview

The localization system consists of three parts:

1. **Translation Data** - JSON file in the API containing translations for all supported languages
2. **Translation API** - REST endpoints to fetch translations
3. **Client Integration** - React context, hooks, and components from `@cohbrgr/localization`

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Shell App                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ QueryClientProvider (shared singleton via Module Federation)│  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ HydrationBoundary (restores SSR query cache)        │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │ Suspense                                      │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │ Content (federated from content app)    │  │  │  │  │
│  │  │  │  │  - useSuspenseQuery for translations    │  │  │  │  │
│  │  │  │  │  - TranslationProvider with fetched data│  │  │  │  │
│  │  │  │  │  - Message components render content    │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ render.tsx: After streaming completes (onAllReady)        │  │
│  │  1. dehydrate(queryClient) - captures all cached queries  │  │
│  │  2. Inject into __initial_state__.dehydratedState         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ fetch (during SSR via useSuspenseQuery)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Server                              │
│  GET /translation/:lang → { lang, keys: { ... } }               │
└─────────────────────────────────────────────────────────────────┘
```

The system uses TanStack Query with SSR hydration:

1. **SSR**: Content component's `useSuspenseQuery` fetches translations, suspending until ready
2. **Dehydration**: After render completes, QueryClient is dehydrated and embedded in HTML
3. **Hydration**: Client's `HydrationBoundary` restores the cache - no refetch needed
4. **Client Navigation**: Subsequent fetches use cache or fetch fresh data as needed

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

### CORS

The API is configured to allow cross-origin requests from the shell app origins:
- Development: `http://localhost:3030`
- Production: `http://localhost:3000`, `https://cohbrgr.com`

## Content App Integration

The Content app fetches translations using TanStack Query's `useSuspenseQuery` hook directly in the Content component.

### Translation Query Options

In `apps/content/src/client/queries/translation.ts`:

```typescript
import { queryOptions } from '@tanstack/react-query';
import { Config } from '@cohbrgr/content/env';

export const fetchTranslations = async (lang: string = 'en') => {
    const response = await fetch(`${Config.apiUrl}/translation/${lang}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }
    return response.json();
};

export const translationQueryOptions = (lang: string = 'en') =>
    queryOptions({
        queryKey: ['translations', lang],
        queryFn: () => fetchTranslations(lang),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
```

### Content Component

In `apps/content/src/client/components/content/Content.tsx`:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { TranslationProvider } from '@cohbrgr/localization';
import { translationQueryOptions } from 'src/client/queries/translation';

const Content = ({ nonce }) => {
    const { data: translations } = useSuspenseQuery(
        translationQueryOptions('en'),
    );

    return (
        <TranslationProvider context={translations}>
            <main>
                <Message id="hero.title" />
                {/* ... */}
            </main>
        </TranslationProvider>
    );
};
```

## Shell App SSR Integration

The shell app provides the QueryClient that federated components (like Content) use for data fetching.

### Module Federation Shared Dependencies

TanStack Query is configured as a singleton shared dependency so the shell and content apps use the same QueryClient instance:

```javascript
// In rspack.federated.config.ts for both shell and content
shared: {
    '@tanstack/react-query': {
        singleton: true,
        requiredVersion: dependencies['@tanstack/react-query'],
    },
}
```

### SSR Render Middleware

In `apps/shell/src/server/middleware/render.tsx`:

```tsx
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { DEHYDRATED_STATE_PLACEHOLDER } from 'src/server/template/components/Javascript.html';

const render = (isProduction, useClientSideRendering) => async (req, res) => {
    // Create QueryClient for SSR - federated components will use this
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { staleTime: 1000 * 60 * 5 },
        },
    });

    const stream = new Promise((resolve, reject) => {
        const { pipe } = renderToPipeableStream(
            <Index queryClient={queryClient} /* ... */ />,
            {
                onAllReady() {
                    // Suspense boundaries have resolved
                    resolve(body);
                },
            },
        );
    });

    const awaitedStream = await stream;
    let markup = await streamToString(awaitedStream);

    // Dehydrate AFTER render completes (Suspense resolved)
    // This captures all queries from federated components
    const dehydratedState = dehydrate(queryClient);
    markup = markup.replace(
        DEHYDRATED_STATE_PLACEHOLDER,
        JSON.stringify(dehydratedState),
    );

    res.send(markup);
};
```

### SSR Template

In `apps/shell/src/server/template/Index.html.tsx`:

```tsx
import { QueryClientProvider } from '@tanstack/react-query';

const Index = ({ queryClient, /* ... */ }) => (
    <html>
        <body>
            <div id="root">
                <QueryClientProvider client={queryClient}>
                    <Suspense fallback={null}>
                        {/* Content component fetches translations here */}
                        <App />
                    </Suspense>
                </QueryClientProvider>
            </div>
            <Javascript /* embeds dehydrated state placeholder */ />
        </body>
    </html>
);
```

### Client Hydration

In `apps/shell/src/client/bootstrap.tsx`:

```tsx
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },
    },
});

const dehydratedState = window.__initial_state__?.dehydratedState;

hydrateRoot(
    root,
    <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
            <Suspense fallback={null}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Suspense>
        </HydrationBoundary>
    </QueryClientProvider>,
);
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

When a translation key is not found, the `Message` component displays the key wrapped in square brackets:

| Condition               | Display            |
| ----------------------- | ------------------ |
| Translation found       | `Translation text` |
| Missing translation key | `[key.name]`       |

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

3. **Use the Message component** for most translations - it handles missing key display

4. **Cache translations** - TanStack Query caches for 1 hour by default, avoiding unnecessary refetches

5. **Graceful degradation** - Missing translations show as `[key]`, making the app functional while clearly indicating what needs translation
