# Chapter 3: Client Application Structure (Shell)

Welcome back! In [Chapter 1: Microfrontend Architecture (Shell & Content)](01_microfrontend_architecture__shell___content__.md), we saw how our project is split into a `shell` and `content` application. Then, in [Chapter 2: Module Federation (via Rspack)](02_module_federation__via_rspack__.md), we learned the magic trick (Module Federation) that allows the `shell` to load code directly from the `content` app while they are both running.

Now, let's focus on the `shell` application itself. Specifically, we'll explore the code that runs *in the user's web browser*. This code makes the website interactive after the initial page has loaded.

## What's the Goal Here? Making the Website Come Alive!

Imagine you load the `cohbrgr` homepage. You see the text and links. That initial view was likely prepared by the server (we'll cover that in [Chapter 4: Server-Side Rendering (SSR) Pipeline (Shell)](04_server_side_rendering__ssr__pipeline__shell__.md)).

But what happens next?
*   What if you click a link to go to a different section? Does the whole page have to reload from scratch? (Hopefully not!)
*   How does the application manage things like which page you're on?
*   How is the overall look and feel (like a header or footer, if we had a complex one) maintained consistently?

This is where the **Client Application Structure** comes in. It's the **React** code running in the browser that takes over the HTML sent by the server and makes it a dynamic, single-page application (SPA). Think of the server delivering the basic structure of a house, and the client-side JavaScript is like the electrician coming in to wire everything up, making the lights and appliances work when you flip a switch.

The main hub for this client-side code in the `shell` app is the `apps/shell/src/client` directory.

## Key Pieces of the Client Structure

Our client application is built using React and has a few main parts working together:

1.  **Entry Point (`bootstrap.tsx`):** The very first script the browser runs to start the React application. It "wakes up" React on the page.
2.  **Root Component (`App.tsx`):** The main React component that holds everything else. It usually sets up the main layout and routing.
3.  **Routing (`react-router-dom`):** Handles showing different "pages" or views based on the URL in the browser, without needing a full page refresh.
4.  **Pages & Components:** Individual React components that represent specific views (`NotFound`, `Offline`) or reusable UI parts (`Layout`).
5.  **State Management (`AppStateContext`):** A way to hold and share application-wide data (like configuration settings) between different components.
6.  **Loading Remote Content:** Using `lazy` and `Suspense` to load components provided by other microfrontends (like our `Content` app) via Module Federation.

Let's look at how these pieces fit together.

## Kicking Things Off: The Entry Point

When the browser loads the initial HTML, it also downloads JavaScript files. The first one for our React app is tiny:

```typescript
// apps/shell/src/client/index.ts
import('./bootstrap.tsx');
```

*   This file simply tells the browser to immediately load and run another file: `bootstrap.tsx`. This technique helps with code splitting, but the main action starts in `bootstrap.tsx`.

Now, let's see `bootstrap.tsx`:

```typescript
// Simplified from apps/shell/src/client/bootstrap.tsx
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client'; // For attaching React
import { BrowserRouter } from 'react-router-dom'; // For routing

import App from 'src/client/App'; // Our main app component
import { AppStateProvider } from 'src/client/contexts/app-state';

const root = document.getElementById('root'); // Find the main HTML container

if (root) {
    // Wake up React and attach it to the server-rendered HTML
    hydrateRoot(
        root,
        <StrictMode> {/* Helps find potential problems */}
            <AppStateProvider context={window.__initial_state__}> {/* Provides shared data */}
                <BrowserRouter> {/* Manages browser history and URLs */}
                    <App /> {/* Render our main application component */}
                </BrowserRouter>
            </AppStateProvider>
        </StrictMode>,
    );
}

// ... service worker registration omitted for simplicity ...
```

*   **`hydrateRoot`**: This is the key function! It tells React to take control of the existing HTML inside the `<div id="root">...</div>` element (which was rendered by the server) instead of clearing it out and starting from scratch. This makes the initial load faster and smoother.
*   **`BrowserRouter`**: We wrap our entire `App` component in this. It listens for changes in the browser's address bar (URL) and allows components like `Route` (which we'll see next) to react to those changes.
*   **`AppStateProvider`**: This component makes application-wide data (passed down from the server as `window.__initial_state__`) available to any component that needs it. We'll touch on state later.
*   **`<App />`**: This is where our application's main structure and logic live.

## The Main App & Routing: Defining Pages

The `App.tsx` file is the heart of our client-side shell. It defines the overall layout and uses `react-router-dom` to decide which "page" component to show based on the current URL.

First, let's define the available paths (URLs) for our app:

```typescript
// apps/shell/src/client/routes.ts
enum AppRoutes {
    start = '/',       // The homepage path
    offline = '/offline', // Path for the offline page
    notFound = '*',    // A catch-all for any other path
}

export default AppRoutes;
```

*   This `enum` just gives us easy-to-remember names for our URL paths. `*` is a special path that matches anything not matched by the other routes.

Now, let's see how `App.tsx` uses these routes:

```typescript
// Simplified from apps/shell/src/client/App.tsx
import { lazy, Suspense, FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom'; // Routing components
import { Spinner } from '@cohbrgr/components'; // Loading indicator
import Layout from 'src/client/components/layout'; // Basic structure
import NotFound from 'src/client/pages/not-found'; // 404 page
import Offline from 'src/client/pages/offline';   // Offline page
import AppRoutes from 'src/client/routes';     // Our defined paths

// Lazily load the Content component from the 'content' microfrontend
const Content = lazy(() => import('content/Content'));

const App: FunctionComponent = () => {
    return (
        <Layout> {/* Apply the basic layout structure */}
            <Routes> {/* Container for defining routes */}
                <Route
                    path={AppRoutes.start} // If URL is '/'
                    element={
                        <Suspense fallback={<Spinner />}> {/* Show spinner while loading */}
                            <Content /> {/* Load and show the Content component */}
                        </Suspense>
                    }
                />
                <Route path={AppRoutes.offline} element={<Offline />} /> {/* If URL is '/offline' */}
                <Route path={AppRoutes.notFound} element={<NotFound />} /> {/* If URL matches anything else */}
            </Routes>
        </Layout>
    );
};

export default App;
```

*   **`<Layout>`**: This component wraps all our pages, providing a consistent structure (though it's very simple in `cohbrgr`). You can find it in `apps/shell/src/client/components/layout/Layout.tsx`.
*   **`<Routes>`**: Provided by `react-router-dom`, this component looks at the current URL.
*   **`<Route>`**: Each `Route` defines a mapping: if the `path` matches the current URL, render the specified `element`.
*   **`lazy(() => import('content/Content'))`**: This is where we use Module Federation (from [Chapter 2](02_module_federation__via_rspack__.md))! `lazy` tells React to only load the `Content` component when it's actually needed (when the route `/` is matched). `import('content/Content')` tells Module Federation to fetch this component from our `content` microfrontend.
*   **`<Suspense fallback={<Spinner />}>`**: While the `Content` component is being loaded over the network (because it's `lazy`), React will render the `fallback` element – in this case, a simple loading `<Spinner />` (which comes from our [Shared Packages (Monorepo)](07_shared_packages__monorepo__.md)). Once `Content` is loaded, it replaces the `Spinner`.
*   **`<Offline />` and `<NotFound />`**: These are regular React components defined within the `shell` application itself (`apps/shell/src/client/pages/`). They are rendered immediately when their routes match.

## Handling Application State

Sometimes, different parts of your application need access to the same information. For example, maybe user login status or configuration settings. In `cohbrgr`, we use React Context for this.

```typescript
// Simplified from apps/shell/src/client/contexts/app-state.tsx
import { createContext, ReactElement } from 'react';
import { State } from 'src/client/store/state'; // Type definition

// Default values if nothing is provided
const initialAppStateContext: State = { nonce: '' };

// Create the context object
export const AppStateContext = createContext<State>(initialAppStateContext);

type ProviderProps = { children?: ReactElement; context: State; };

// Create the Provider component
export const AppStateProvider = ({ children, context }: ProviderProps) => {
    return (
        <AppStateContext.Provider value={context}> {/* Makes 'context' available */}
            {children} {/* Renders the components wrapped by it */}
        </AppStateContext.Provider>
    );
};
```

*   **`createContext`**: Creates a context object.
*   **`AppStateProvider`**: A component that wraps parts of our app (in `bootstrap.tsx`, it wraps the whole app). It takes a `value` (our initial state) and makes it available to any component *inside* it that asks for this context.
*   In `cohbrgr`, the main piece of state passed this way is `nonce`, used for security purposes with scripts.

## How it Works: Client-Side Navigation

Let's trace what happens when the app is already running and you click a link (handled by `react-router-dom`'s `<Link>` component, which is used inside `NotFound.tsx`, for example):

1.  **User Click:** You click a link like `<Link to="/">return</Link>` inside the `NotFound` page.
2.  **Router Intercepts:** `BrowserRouter` prevents the browser's default behavior (which would be a full page reload). Instead, it updates the URL in the address bar using the browser's History API.
3.  **State Update:** `BrowserRouter` detects the URL change.
4.  **App Re-renders:** The `App` component (and potentially others) re-renders because the "location" (URL) it depends on has changed.
5.  **Route Matching:** The `<Routes>` component inside `App.tsx` re-evaluates the routes against the new URL (`/`).
6.  **Component Swap:** It finds the matching `<Route path="/" ... />`. React efficiently updates the DOM to render the `element` of this route (the `Suspense`/`Content` combo) in place of the previous route's element (`NotFound`). If `Content` was already loaded, it appears instantly; otherwise, the `Spinner` shows briefly.

Here's a diagram showing this client-side flow:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant BrowserRouter (React Router)
    participant App Component
    participant Target Component (e.g., Content or NotFound)

    User->>Browser: Clicks <Link to="/new-path">
    Browser->>BrowserRouter (React Router): Intercepts click, updates URL silently
    BrowserRouter (React Router)->>App Component: Notifies of URL change
    App Component->>App Component: Re-renders, checks <Routes>
    App Component->>Target Component (e.g., Content or NotFound): Matches route, renders the corresponding component
    Target Component (e.g., Content or NotFound)->>Browser: React updates the necessary parts of the page DOM
```

This process makes navigation feel fast and smooth, like a desktop application, because only the necessary parts of the page are re-rendered, and no full HTML page reload occurs.

## Conclusion

You've now seen the structure of the `shell` application's client-side code! This React application, primarily located in `apps/shell/src/client`, takes over after the initial HTML load.

Key takeaways:
*   It starts with `bootstrap.tsx`, which uses `hydrateRoot` to attach React to the server-rendered HTML.
*   `App.tsx` uses `react-router-dom` (`<Routes>` and `<Route>`) to manage different pages based on the URL.
*   It uses `lazy` and `Suspense` along with Module Federation's `import()` syntax to load components from other microfrontends (like `content`).
*   React Context (`AppStateProvider`) is used for simple state sharing.
*   Client-side routing provides fast navigation without full page reloads.

But how did that initial HTML get generated with the right content *before* the client-side JavaScript took over? That's the job of Server-Side Rendering (SSR).

**Next Up:** [Server-Side Rendering (SSR) Pipeline (Shell)](04_server_side_rendering__ssr__pipeline__shell__.md)

---

Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge)