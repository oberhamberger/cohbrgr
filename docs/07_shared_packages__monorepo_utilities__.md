# Chapter 7: Shared Packages (Monorepo Utilities)

In the [previous chapter](06_rspack_build_configuration_.md), we learned how the [Rspack Build Configuration](06_rspack_build_configuration_.md) acts like a recipe book, telling our build tool how to prepare our code for the browser and server. Now, let's look at how we organize and share common code within our `cohbrgr` project.

## What's the Big Idea? The Shared Workshop Toolbox

Imagine you have two different teams working on building different parts of a car. Team A is building the car's body (our [Shell Application (Host)](01_shell_application__host__.md)) and Team B is building the engine (our [Content Application (Remote Microfrontend)](02_content_application__remote_microfrontend__.md)).

Now, imagine both teams need the *exact same* special screwdriver and the *exact same* type of wrench. Should each team buy their own set? That would be wasteful and maybe Team A buys a slightly different wrench than Team B, causing small inconsistencies.

A much better approach is to have a central, shared toolbox in the workshop where high-quality tools are kept. Any team can grab the screwdriver or wrench they need from this shared toolbox.

That's exactly what the `packages/` directory is in our `cohbrgr` project! It's our **shared workshop toolbox**.

Instead of duplicating code (like UI components or helper functions) in both the `shell` and `content` applications, we put that shared code into separate "packages" inside the `packages/` directory. Both the `shell` and `content` applications can then easily use these shared tools.

This approach helps us:

1.  **Reduce Duplication:** Write code once, use it in many places.
2.  **Ensure Consistency:** Everyone uses the exact same "tool" (component, function, configuration).
3.  **Simplify Maintenance:** If a tool needs an upgrade (a bug fix in a shared component), we only need to update it in one place (the shared package).

## A Look Inside Our Monorepo Structure

Our `cohbrgr` project uses a **monorepo** structure, meaning all our code (for the shell app, the content app, and shared packages) lives in a single main code repository. You'll typically see two main folders:

*   `apps/`: Contains the actual applications users interact with (`shell`, `content`). These are the "workers" building their specific parts.
*   `packages/`: Contains the shared code, utilities, and configurations – our "shared toolbox".

```
cohbrgr/
├── apps/
│   ├── shell/       # The main host application (Worker A)
│   └── content/     # The microfrontend application (Worker B)
├── packages/        # The Shared Toolbox!
│   ├── components/  # Shared React UI components
│   ├── utils/       # Shared helper functions
│   ├── server/      # Shared server middleware
│   ├── build/       # Shared build configurations (Rspack)
│   ├── eslint/      # Shared code style rules
│   ├── prettier/    # Shared code formatting rules
│   └── jest/        # Shared testing configurations
└── package.json     # Main project configuration
```

## Exploring the Shared Toolbox (`packages/`)

Let's briefly look at the different "tools" (packages) inside our `packages/` directory:

*   `packages/components`: Contains reusable React components like `Spinner` or `Navigation` that can be used in both the `shell` and `content` apps to maintain a consistent look and feel. (Think: Hammers, Saws)
*   `packages/utils`: Holds common helper functions, like our `Logger`, that might be needed across different parts of the project. (Think: Tape Measures, Levels)
*   `packages/server`: Provides shared middleware functions for our [Express Server & Middleware (Shell)](04_express_server___middleware__shell__.md), like `logging` or `methodDetermination`. (Think: Standard Operating Procedures)
*   `packages/build`: Contains shared parts of the [Rspack Build Configuration](06_rspack_build_configuration_.md) to ensure both `shell` and `content` are built using similar base rules. (Think: Blueprints, Power Tool Manuals)
*   `packages/eslint`: Defines the project's standard rules for code style and quality checking (using ESLint). (Think: Workshop Safety Rules)
*   `packages/prettier`: Defines the rules for automatic code formatting (using Prettier) to keep everything tidy. (Think: Workshop Organization Guidelines)
*   `packages/jest`: Contains shared configuration for running automated tests (using Jest). (Think: Quality Control Checklists)

## How to Use a Shared Package

Using code from a shared package is straightforward. Inside the code for an application (like `apps/shell` or `apps/content`), you simply `import` what you need using the package name.

These shared packages are often given a special scope name (like `@cohbrgr/`) to make it clear they belong to our project.

**Example: Using the Shared `Spinner` Component**

Remember in [Chapter 1](01_shell_application__host__.md), the `shell` application showed a loading spinner while fetching the `content` microfrontend? That `Spinner` component comes from our shared toolbox!

```typescript
// apps/shell/src/client/App.tsx (Simplified)
import React, { lazy, Suspense } from 'react';
// *** Import Spinner from the shared components package ***
import { Spinner } from '@cohbrgr/components';
// ... other imports ...

// Dynamically import the Content component from the remote app
const Content = lazy(() => import('content/Content'));

const App: React.FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route
                    path={AppRoutes.start}
                    element={
                        {/* Use the imported Spinner as a fallback */}
                        <Suspense fallback={<Spinner />}>
                            <Content />
                        </Suspense>
                    }
                />
                {/* ... other routes ... */}
            </Routes>
        </Layout>
    );
};

export default App;
```

*Explanation:* The line `import { Spinner } from '@cohbrgr/components';` tells JavaScript: "Go find the package named `@cohbrgr/components` and give me the `Spinner` component it exports." The `shell` app doesn't need to know *where* that package lives on the disk; the project setup handles that connection.

**Example: Using the Shared `Logger` Utility**

Similarly, the shared `logging` middleware in `packages/server` uses the shared `Logger` from `packages/utils`.

```typescript
// packages/server/src/middleware/logging.ts (Simplified)
// *** Import Logger from the shared utils package ***
import { Logger } from '@cohbrgr/utils';
import { NextFunction, Request, Response } from 'express';

export const logging =
    (isProduction: boolean) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!isProduction) {
            // *** Use the imported Logger ***
            Logger.info(`Requesting: ${req.url}`);
        }
        // ... rest of the function ...
        next();
    };
```

*Explanation:* `import { Logger } from '@cohbrgr/utils';` brings in the shared logging tool, ready to be used within the `logging` middleware function.

## Under the Hood: How the Connection Works

You might be wondering: how does `import { Spinner } from '@cohbrgr/components';` actually find the code in `packages/components/src/spinner/Spinner.tsx`? It's not magic, but rather the result of our monorepo tooling working together:

1.  **Package Manager Workspaces (e.g., pnpm):** Tools like `pnpm` (or Yarn/NPM workspaces) are configured in the root `package.json` file. When you run `pnpm install`, the package manager recognizes that `apps/shell` depends on `@cohbrgr/components`. Instead of downloading it from the internet, it creates a **symbolic link** (symlink) inside `apps/shell/node_modules/@cohbrgr/components` that points directly to the `packages/components` folder in our project. This links everything together locally.
2.  **TypeScript Configuration (`tsconfig.json`):** TypeScript needs to understand these links to provide correct type checking and autocompletion. Often, a root `tsconfig.json` file defines `paths` aliases that map package names (like `@cohbrgr/*`) to their actual locations within the `packages/` directory. This helps the TypeScript compiler find the source code.
3.  **Bundler Configuration (Rspack):** Finally, our bundler ([Rspack Build Configuration](06_rspack_build_configuration_.md)) needs to resolve these imports during the build process. Its `resolve` configuration (often inheriting settings or using plugins compatible with TypeScript paths) ensures that when it sees `import ... from '@cohbrgr/components'`, it follows the symlink or path mapping to find the actual source code files in `packages/components` and bundle them correctly.

```mermaid
graph LR
    A[Shell App Code (apps/shell)] -- imports --> B["@cohbrgr/components"];
    B -- in node_modules --> C{Symlink created by pnpm};
    C -- points to --> D[Shared Code (packages/components)];

    subgraph "Developer Experience"
        T[TypeScript (tsconfig.json paths)] -- helps find types --> D;
    end
    subgraph "Build Process"
        R[Rspack (resolve config)] -- finds code for bundling --> D;
    end

    style B fill:#eee,stroke:#333,stroke-width:2px
```

*Diagram Explanation:* The `Shell App` code imports from the package name (`@cohbrgr/components`). The package manager (`pnpm`) creates a symlink in `node_modules` pointing to the actual shared code directory (`packages/components`). TypeScript uses `tsconfig.json` paths to understand this link for type checking, and Rspack uses its configuration to find the code during the build.

This setup allows us to treat shared packages almost like external libraries, even though they live right inside our own project repository.

## Conclusion

In this chapter, we explored the concept of **Shared Packages (Monorepo Utilities)** using the `packages/` directory in `cohbrgr`. Think of it as the shared workshop toolbox, filled with reusable components (`components`), helper functions (`utils`), configurations (`build`, `eslint`, `prettier`, `jest`), and server logic (`server`).

Key takeaways:

*   Monorepos organize multiple applications and shared libraries in one repository.
*   The `packages/` directory holds code shared across different applications (`apps/`).
*   This promotes **code reuse**, **consistency**, and **easier maintenance**.
*   Applications import shared code using package names (e.g., `@cohbrgr/components`).
*   Tooling like package manager workspaces, TypeScript paths, and bundler resolution makes these imports work seamlessly.

This chapter concludes our journey through the core concepts of the `cohbrgr` project! You've learned about the [Shell Application (Host)](01_shell_application__host__.md), the [Content Application (Remote Microfrontend)](02_content_application__remote_microfrontend__.md), how they connect via [Module Federation Setup](03_module_federation_setup_.md), the role of the [Express Server & Middleware (Shell)](04_express_server___middleware__shell__.md), the magic of the [Server-Side Rendering (SSR) Pipeline](05_server_side_rendering__ssr__pipeline_.md), the importance of the [Rspack Build Configuration](06_rspack_build_configuration_.md), and finally, how shared code is managed using [Shared Packages (Monorepo Utilities)](07_shared_packages__monorepo_utilities__.md).

We hope this tutorial has given you a solid foundation for understanding and working with modern microfrontend architectures like the one used in `cohbrgr`. Happy coding!

---

Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge)