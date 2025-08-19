# Introduction

Welcome to the cohbrgr project! This project is a monorepo that contains a collection of applications and packages that work together to create a modern web application.

This documentation is intended to help new developers get started with the project. It provides a high-level overview of the project's architecture, as well as detailed information about the different applications and packages.

## Foundational Ideas and Concepts

The cohbrgr project is built around a few foundational ideas and concepts:

- **Monorepo:** The project is organized as a monorepo, which means that all the code for all the applications and packages is stored in a single repository. This makes it easier to manage dependencies and share code between different parts of the project.
- **Micro-frontends:** The project uses a micro-frontend architecture, which means that the user interface is composed of multiple, independently deployable applications. This makes it easier to develop and maintain large and complex user interfaces.
- **Module Federation:** The micro-frontends are implemented using Module Federation, which is a feature of Webpack and Rspack that allows separately compiled and deployed applications to share code and dependencies at runtime.
- **Server-Side Rendering (SSR):** The main application is server-side rendered, which means that the initial HTML is generated on the server and sent to the client. This improves performance and SEO.
- **TypeScript:** The entire project is written in TypeScript, which is a typed superset of JavaScript that helps to prevent errors and improve code quality.
- **React:** The user interface is built using React, which is a popular JavaScript library for building user interfaces.
- **Rspack:** The project uses Rspack as its build tool. Rspack is a fast, Rust-based bundler that is compatible with Webpack.
