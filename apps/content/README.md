# Content Application

The `@cohbrgr/content` application is a remote micro-frontend that is consumed by the `@cohbrgr/shell` application. It is responsible for rendering the main content of the cohbrgr website.

## Architecture

The `content` application is a remote application in a module federation setup. It exposes the `Content` component, which is then consumed by the `shell` application.

### Module Federation

Module federation is configured using the `@cohbrgr/build` package, which provides a set of rspack configurations. The federation configuration for the `content` application can be found in `apps/content/build/configs/rspack.federated.config.ts`.

The `content` application exposes the following component:

-   `./Content`: The main content component, located at `apps/content/src/client/components/content/Content.tsx`.

### Exposed Component

The `Content` component is a simple React component that renders the main content of the website, including a short introduction and links to social media profiles. It also includes a `StructuredData` component that adds structured data to the page for SEO purposes.

## Consumption by `@cohbrgr/shell`

The `content` application is intended to be consumed by the `@cohbrgr/shell` application. The `shell` application is configured to consume the `Content` component from the `content` remote application.

The `shell` application dynamically loads the `Content` component using `React.lazy` and renders it within a `Suspense` boundary. This allows the `shell` to display a loading indicator while the `content` micro-frontend is being fetched.
