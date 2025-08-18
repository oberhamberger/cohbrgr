# Shell Application

The `shell` application is the main container application for the cohbrgr website. It is responsible for rendering the overall layout and orchestrating the loading of micro-frontends.

## Architecture

The `shell` application is a host application in a module federation setup. It consumes micro-frontends that are exposed by remote applications. The primary micro-frontend consumed by the `shell` is the `content` application.

### Module Federation

Module federation is configured using the `@cohbrgr/build` package, which provides a set of rspack configurations. The federation configuration for the `shell` application can be found in `apps/shell/build/configs/rspack.federated.config.ts`.

The `shell` application exposes no components itself, but it consumes the `Content` component from the `content` remote application.

### Server-Side Rendering (SSR)

The `shell` application is server-side rendered. The SSR logic is initiated in `apps/shell/src/server/index.ts`, which dynamically imports the server entry point at `apps/shell/src/server/server-entry.ts`.

The `server-entry.ts` file then dynamically imports the rendering middleware from `apps/shell/src/server/middleware/render.tsx`. This middleware is responsible for rendering the main HTML document and streaming it to the client.

The `render.tsx` middleware renders the `Index.html.tsx` component, which is the main template for the application. This component includes the client-side application by rendering the `<App />` component.

### Client-Side Rendering

The client-side application is bootstrapped in `apps/shell/src/client/bootstrap.tsx`. The main application component is `apps/shell/src/client/App.tsx`.

The `App.tsx` component is responsible for routing and for loading the `content` micro-frontend. It uses `React.lazy` to dynamically import the `Content` component from the `content` remote application. While the `Content` component is loading, a `Spinner` component is displayed.

## Connection to `/apps/content`

The `shell` application is tightly coupled with the `content` application. The `content` application is a remote application that exposes a `Content` component. The `shell` application consumes this component and renders it as the main content of the page.

The connection is established through the module federation configuration. The `shell` application defines a remote called `content` that points to the `content` application's remote entry file. The `shell` application can then import the `Content` component from `content/Content`.

## Other Capabilities

In addition to its primary role as a host application, the `shell` application provides several other capabilities:

### Security

The `shell` application includes several security features to protect against common web vulnerabilities:

-   **Helmet:** The `helmet` middleware is used to set various HTTP headers to secure the application.
-   **Express Rate Limit:** The `express-rate-limit` middleware is used to limit repeated requests to public APIs and/or endpoints.
-   **NoCache:** The `nocache` middleware is used to disable browser caching.

### Performance

The `shell` application is optimized for performance:

-   **Compression:** The `compression` middleware is used to compress response bodies for all requests that traverse through the middleware.
-   **Web Vitals:** The `web-vitals` library is used to measure and log key performance metrics (CLS, INP, LCP) to the console.

### Offline Support

The `shell` application provides offline support using service workers. The `workbox` library is used to create and manage the service worker. The service worker configuration can be found in `apps/shell/src/client/service-worker`.

### Static Assets

The `apps/shell/src/client/assets` directory contains static assets such as icons, the `manifest.json` file, and the `robots.txt` file. These assets are served by the Express server.
