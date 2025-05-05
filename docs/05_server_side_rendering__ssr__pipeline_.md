# Chapter 5: Server-Side Rendering (SSR) Pipeline

In the [previous chapter](04_express_server___middleware__shell__.md), we saw how the [Express Server & Middleware (Shell)](04_express_server___middleware__shell__.md) acts like the front desk of our application building, handling incoming requests, doing some basic checks, and serving static files. But what happens when a user requests an actual page, like the homepage? The front desk (Express) needs to hand off the request to someone who can actually *build* the page content. That's where the **Server-Side Rendering (SSR) Pipeline** comes in!

## What's the Big Idea? The Chef in the Kitchen

Imagine going to a fancy restaurant. When you order your main course, you don't want the waiter to bring you a box of raw ingredients (like uncooked pasta, raw vegetables, and spices) and tell you to cook it yourself at the table. That would take time, and you wouldn't be able to eat right away!

Instead, you expect the chef in the kitchen (the **server**) to prepare the dish (the **HTML page**) completely. When the waiter brings it out, it's ready to eat (**visible and usable**).

This is exactly what Server-Side Rendering (SSR) does for our web application:

*   **Problem:** If the server just sends a basic HTML file with links to JavaScript (this is called Client-Side Rendering or CSR), the browser shows a blank white page while it downloads, parses, and runs the JavaScript to figure out what to display. This can feel slow, especially on slower networks or devices. Also, search engines might have trouble understanding the content if it's not present in the initial HTML.
*   **Solution (SSR):** The server runs our application code (specifically, our React components) *before* sending anything to the browser. It generates the complete HTML for the requested page on the server itself.
*   **Benefit:** The browser receives ready-to-display HTML. The user sees the content almost immediately! This improves the *perceived performance* (how fast the site feels) and makes it easier for search engines (like Google) to index the site (good for **SEO** - Search Engine Optimization).

The **SSR Pipeline** is the system responsible for taking a user request, running the React application code within a Node.js environment on the server, rendering it into HTML, and sending that HTML back to the browser.

## Key Concepts: The Ingredients of SSR

Let's break down the main parts of our SSR pipeline:

1.  **Server Environment (Node.js):** We need a place to run our React code *outside* of a browser. Node.js lets us do this. Our [Express Server & Middleware (Shell)](04_express_server___middleware__shell__.md) already runs in Node.js.
2.  **React Rendering Function (`renderToPipeableStream`):** React provides special functions designed to render components into HTML on the server. We use `renderToPipeableStream`, which is efficient because it allows *streaming*.
3.  **Streaming:** Instead of waiting for the *entire* HTML page to be generated (which might take time if our app needs to fetch data), the server starts sending the HTML in chunks as soon as parts of it are ready. The browser can start displaying the beginning of the page (like the header) while the server is still working on the rest. Think of it like getting your appetizer before the main course is fully cooked.
4.  **HTML Template (`Index.html.tsx`):** This is a React component that defines the overall structure of the HTML document (`<html>`, `<head>`, `<body>`). It acts as a wrapper around our main application (`<App />`) and includes placeholders for things like CSS links and JavaScript file includes.
5.  **Routing (`StaticRouter`):** On the server, we don't have a browser address bar changing. We need to tell our React app which page the user requested. We use `StaticRouter` (from `react-router-dom`) to wrap our app, passing in the requested URL.
6.  **Hydration (Client-Side):** Once the server-rendered HTML arrives in the browser, it looks like a complete page, but it's just static HTML. The JavaScript code still needs to run in the browser to make the page interactive (e.g., make buttons clickable). This process of React "attaching" itself to the existing server-rendered HTML is called **hydration**. We saw this briefly in [Chapter 1](01_shell_application__host__.md) with `hydrateRoot` in `bootstrap.tsx`.

## How It Works: From Request to Rendered Page

Let's follow a request for the homepage (`/`) as it goes through the SSR pipeline (picking up after Express middleware):

1.  **Hand-off:** The [Express Server & Middleware (Shell)](04_express_server___middleware__shell__.md) determines this isn't a request for a static file and passes it to our main SSR handler function (configured in `apps/shell/src/server/index.ts`).
2.  **Prepare Components:** The SSR handler wraps our main `<App />` component inside the necessary server-side tools:
    *   `<StaticRouter location={req.url}>`: Tells the app which page to render based on the incoming request URL.
    *   `<Index isProduction={...} location={req.url} ...>`: Provides the overall HTML structure.
3.  **Start Rendering:** The handler calls React's `renderToPipeableStream` function, passing in the prepared component tree (`<Index><StaticRouter><App /></StaticRouter></Index>`).
4.  **React Renders:** React starts executing the component code *on the server*. It figures out the HTML output for the header, footer, and crucially, uses Module Federation *on the server* to load and render the `Content` component from our [Content Application (Remote Microfrontend)](02_content_application__remote_microfrontend__.md).
5.  **Streaming Begins:** As soon as React has generated the initial part of the HTML (e.g., the `<head>` section and the opening `<body>` tag), `renderToPipeableStream` starts sending ("piping") this HTML through the Express response (`res`) object back to the browser.
6.  **Stream Continues:** React continues rendering the rest of the page (including the content fetched via Module Federation). As more HTML chunks are generated, they are immediately streamed to the browser.
7.  **All Ready:** Once the main structure is rendered, a signal (`onAllReady`) tells our handler it's safe to set the final HTTP status code (e.g., 200 OK) and complete the streaming.
8.  **Browser Receives:** The browser receives the HTML stream, parsing and displaying it as it arrives. The user sees content much faster than waiting for JavaScript.
9.  **Hydration:** Later, the browser downloads and runs the client-side JavaScript (like `bootstrap.tsx`), which then hydrates the static HTML, making it fully interactive.

## Under the Hood: Peeking into the Kitchen

Let's visualize the flow and look at some simplified code snippets.

**Flow Diagram:**

```mermaid
sequenceDiagram
    participant Ex as Express Server
    participant SSR as SSR Handler (render.tsx)
    participant React as React (renderToPipeableStream)
    participant Idx as Index Template Component
    participant App as App Component (Server-side)
    participant B as Browser

    Ex->>SSR: Handle request ('/')
    SSR->>React: Call renderToPipeableStream(<Idx><App /></Idx>)
    React->>Idx: Execute Index template
    Idx->>App: Execute App component (inside StaticRouter)
    App-->>Idx: Return App's structure
    Idx-->>React: Return initial HTML structure
    React->>SSR: Start streaming HTML chunks (e.g., <head>)
    SSR->>B: Pipe HTML chunks to Browser
    Note over React, Idx, App: App might load remote MF content here...
    React->>SSR: Stream more HTML (rendered <App />)
    SSR->>B: Pipe more HTML chunks
    React->>SSR: Signal onAllReady (main shell ready)
    SSR->>B: Finish piping HTML
    B->>B: Display received HTML
    B->>Ex: Request client JS files (later)
    Ex->>B: Serve JS files
    B->>B: Run JS and Hydrate HTML
```

**Code Snippets:**

**1. Triggering the Render (`apps/shell/src/server/index.ts`)**

This connects the Express app to our rendering logic.

```typescript
// apps/shell/src/server/index.ts (simplified)
import express from 'express';
// ... other imports ...

const app = express();
// ... middleware setup (logging, static files, etc.) ...

// Dynamically import the function that creates the render middleware
const { default: createRenderThunk } = await import('./server-entry');
// Get the actual rendering function
const serverRender = createRenderThunk();

// Use the serverRender function as the final handler for requests
app.use(serverRender);

// ... start server ...
```

This code imports and sets up the `serverRender` function, which will be called for page requests.

**2. The Render Middleware Creator (`apps/shell/src/server/server-entry.ts`)**

This small file just imports and returns the actual rendering function from another file.

```typescript
// apps/shell/src/server/server-entry.ts (simplified)
import type { Request, Response } from 'express';

// This function imports and returns the actual rendering middleware
const createRenderThunk = () => async (req: Request, res: Response) => {
    // Load the render function from './middleware/render'
    // @ts-expect-error simplified import
    const renderer = (await import('./middleware/render')).default;
    // Call the loaded renderer with the request and response
    return renderer(true, true)(req, res); // Passing flags (simplified)
};

export default createRenderThunk;
```

**3. The Core SSR Logic (`apps/shell/src/server/middleware/render.tsx`)**

This is where the magic happens: calling React's rendering function.

```typescript
// apps/shell/src/server/middleware/render.tsx (simplified)
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream'; // Used for streaming
// Import the HTML template component
import Index from 'src/server/template/Index.html';
// ... other imports (Logger) ...

// The main render function factory
const render = (isProd: boolean, useCSR: boolean) =>
    async (req: Request, res: Response) => {
        // Start the React render-to-stream process
        const { pipe, abort } = renderToPipeableStream(
            // Pass our HTML template component, providing request URL
            <Index
                isProduction={isProd}
                location={req.url}
                useCSR={useCSR}
                /* ... other props ... */
            />,
            {
                // This function runs when the main shell is ready
                onAllReady() {
                    res.statusCode = 200; // Set success status
                    res.setHeader('Content-Type', 'text/html');
                    // Create a stream to pipe the HTML into
                    const body = new PassThrough();
                    // Connect React's output stream to our response stream
                    pipe(body);
                    // Send the stream to the browser
                    body.pipe(res);
                },
                // Handle errors during rendering
                onError(error) {
                    console.error(error);
                    res.statusCode = 500;
                    res.send('<h2>Something went wrong</h2>');
                },
            }
        );
        // Abort rendering if it takes too long (e.g., 5 seconds)
        setTimeout(abort, 5000);
};

export default render;
```

This function sets up the call to `renderToPipeableStream`, provides the root component (`Index`), and defines callbacks for when rendering is ready (`onAllReady`) or encounters errors (`onError`). Crucially, it `pipe`s the output stream to the Express response (`res`).

**4. The HTML Template Component (`apps/shell/src/server/template/Index.html.tsx`)**

This component defines the basic HTML document structure.

```typescript
// apps/shell/src/server/template/Index.html.tsx (simplified)
import { FunctionComponent } from 'react';
// Import StaticRouter for server-side routing
import { StaticRouter } from 'react-router-dom';
// Import the main App component
import App from 'src/client/App';
// Import components to include JS/CSS links (simplified)
import Javascript from './components/Javascript.html';
import Stylesheets from './components/Stylesheets.html';

interface IIndexProps { location: string; /* ... other props ... */ }

const Index: FunctionComponent<IIndexProps> = (props) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <title>Christian Oberhamberger</title>
                {/* Placeholder for CSS links */}
                <Stylesheets /* ... props ... */ />
            </head>
            <body>
                {/* The div where React will hydrate on the client */}
                <div id="root">
                    {/* StaticRouter uses the request URL */}
                    <StaticRouter location={props.location}>
                        {/* Render the main Application */}
                        <App />
                    </StaticRouter>
                </div>
                {/* Placeholder for JavaScript tags */}
                <Javascript /* ... props ... */ />
            </body>
        </html>
    );
};

export default Index;
```

This component renders the standard HTML tags, includes the `<App />` component wrapped in `<StaticRouter>`, and adds placeholders (`<Stylesheets />`, `<Javascript />`) which will render the necessary `<link>` and `<script>` tags pointing to our built assets. The `<div id="root">` is the crucial container that client-side React will later attach to during hydration.

## Conclusion

You've now learned about the **Server-Side Rendering (SSR) Pipeline**, the process that makes our application feel faster and improves SEO.

Key takeaways:

*   SSR generates the initial HTML on the **server** using React and Node.js.
*   It uses `renderToPipeableStream` for efficient **streaming** of HTML to the browser.
*   The user sees content much **faster** compared to traditional Client-Side Rendering.
*   It involves an **HTML template** (`Index.html.tsx`), server-side **routing** (`StaticRouter`), and is completed by client-side **hydration**.

This powerful technique relies on having different versions of our code: one bundle to run on the server (for SSR) and another bundle to run in the browser (for hydration and interactivity). How are these different bundles created? That's the job of our build tool configuration, which we'll explore next.

Next Up: [Rspack Build Configuration](06_rspack_build_configuration_.md)

---

Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge)