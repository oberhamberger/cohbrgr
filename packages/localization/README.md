# @cohbrgr/localization

This package provides internationalization (i18n) utilities for React applications, including translation context, hooks, and components.

## Installation

```bash
pnpm add @cohbrgr/localization
```

## Exports

| Export                    | Type      | Description                               |
| ------------------------- | --------- | ----------------------------------------- |
| `TranslationProvider`     | Component | Context provider for translations         |
| `TranslationContext`      | Context   | React context for translation values      |
| `useTranslation`          | Hook      | Access translation context                |
| `Message`                 | Component | Render translated text by key             |
| `TranslationKey`          | Type      | Union of all valid translation keys       |
| `TranslationKeys`         | Type      | Record mapping keys to translated strings |
| `TranslationResponse`     | Type      | API response shape for translations       |
| `TranslationContextValue` | Type      | Shape of the translation context value    |

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

| Prop       | Type                                                           | Description      |
| ---------- | -------------------------------------------------------------- | ---------------- |
| `children` | `ReactElement`                                                 | Child components |
| `context`  | `{ lang: string; keys: TranslationKeys; isDefault?: boolean }` | Translation data |

```tsx
import { TranslationProvider } from '@cohbrgr/localization';

const translations = {
    lang: 'en',
    keys: { 'hero.title': 'Hello World' /* ... */ },
    isDefault: false,
};

<TranslationProvider context={translations}>
    <App />
</TranslationProvider>;
```

### `Message`

Component that renders translated text based on a translation key.

**Props:**

| Prop       | Type             | Default | Description                               |
| ---------- | ---------------- | ------- | ----------------------------------------- |
| `id`       | `TranslationKey` | -       | The translation key to look up            |
| `fallback` | `string`         | -       | Fallback text if key not found            |
| `html`     | `boolean`        | `false` | Render content as HTML (use with caution) |

**Development Mode Behavior:**

In development (`NODE_ENV !== 'production'`), the Message component wraps text in square brackets `[text]` when:

- Using default/fallback translations (`isDefault: true`)
- A translation key is missing

This makes it easy to identify untranslated content during development.

```tsx
import { Message } from '@cohbrgr/localization';

// Basic usage
<h1><Message id="hero.title" /></h1>

// With fallback
<p><Message id="missing.key" fallback="Default text" /></p>

// Render HTML content
<p><Message id="hero.text" html /></p>
```

## Hook

### `useTranslation`

Hook to access translation context values.

**Returns:** `TranslationContextValue`

| Property    | Type                              | Description                        |
| ----------- | --------------------------------- | ---------------------------------- |
| `lang`      | `string`                          | Current language code              |
| `keys`      | `TranslationKeys`                 | All translation key-value pairs    |
| `translate` | `(key: TranslationKey) => string` | Get translation for a key          |
| `isDefault` | `boolean`                         | Whether using default translations |

```tsx
import { useTranslation } from '@cohbrgr/localization';

const MyComponent = () => {
    const { translate, lang, isDefault } = useTranslation();

    return (
        <div>
            <p>Language: {lang}</p>
            <p>{translate('hero.title')}</p>
            {isDefault && <span>Loading translations...</span>}
        </div>
    );
};
```

## Fallback Behavior

When translations are not loaded (e.g., during SSR or before the API response), the translation key itself is returned as the fallback. In development mode, untranslated keys are wrapped in brackets `[key]` to make them easy to identify.

## Usage Example

```tsx
import {
    Message,
    TranslationProvider,
    useTranslation,
    TranslationKeys,
} from '@cohbrgr/localization';

// App setup with provider
const App = () => {
    const [translations, setTranslations] = useState<TranslationKeys>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/translation/en')
            .then((res) => res.json())
            .then((data) => {
                setTranslations(data.keys);
                setIsLoaded(true);
            });
    }, []);

    return (
        <TranslationProvider
            context={{ lang: 'en', keys: translations, isDefault: !isLoaded }}
        >
            <HomePage />
        </TranslationProvider>
    );
};

// Using Message component
const HomePage = () => (
    <main>
        <h1>
            <Message id="hero.title" />
        </h1>
        <p>
            <Message id="hero.text" html />
        </p>
    </main>
);

// Using hook directly
const LanguageInfo = () => {
    const { lang, translate } = useTranslation();
    return (
        <span>
            {translate('hero.subtitle')} ({lang})
        </span>
    );
};
```
