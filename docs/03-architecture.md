# Architecture

This project follows a micro-frontend architecture using Module Federation. This means the application is composed of a `shell` application that consumes one or more remote applications.

## Monorepo

The project is structured as a monorepo, containing two main directories:

- `/apps`: Contains the applications, which are the deployable units of the project.
- `/packages`: Contains shared packages that are used by the applications.

## Micro-frontends with Module Federation

The application is split into two main parts:

- **`@cohbrgr/shell`**: The host application that renders the main layout and navigation.
- **`@cohbrgr/content`**: A remote application that exposes a `Content` component.

The `shell` application consumes the `Content` component from the `content` application at runtime using Module Federation. This allows the two applications to be developed, deployed, and scaled independently.

### Server-Side Rendering (SSR)

The `shell` application is server-side rendered. When a user requests a page, the server renders the initial HTML and sends it to the client. This improves the initial loading performance and provides better SEO.

The `shell`'s server then fetches the `Content` component from the `content` application's server and injects it into the rendered HTML.

### Client-Side Hydration

After the initial HTML is loaded on the client, the client-side React application takes over. This process is called hydration. The client-side application makes the page interactive and dynamically loads other components as needed.
