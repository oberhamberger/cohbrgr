# `@cohbrgr/components`

This package contains shared UI components used across the Cohbrgr application.

## Components

### `Navigation`

A navigation component that renders its children as list items within a `nav` element.

#### Props

- `children`: `ReactNode` - The content to be rendered inside the navigation. Each direct child will be wrapped in an `<li>` tag.

#### Usage

```typescript jsx
import Navigation from '@cohbrgr/components/src/navigation';

<Navigation>
  <a href="/">Home</a>
  <a href="/about">About</a>
</Navigation>
```

### `Spinner`

A simple loading spinner component with a ripple effect.

#### Props

None.

#### Usage

```typescript jsx
import { Spinner } from '@cohbrgr/components';

<Spinner />
```
