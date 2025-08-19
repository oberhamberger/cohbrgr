# Getting Started

This guide will walk you through the process of setting up your development environment and running the applications.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/oberhamberger/cohbrgr.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd cohbrgr
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

## Development

To start the development servers for all applications, run the following command:

```bash
npm start
```

This will start the `shell` and `content` applications in development mode. The `shell` application will be available at `http://localhost:3030`, and the `content` application will be available at `http://localhost:3031`.

### Building for Production

To build the applications for production, run the following command:

```bash
npm run build
```

This will create a `dist` directory in each application's directory, containing the production-ready assets.

### Running in Production Mode

To run the applications in production mode, you first need to build them. Then, you can start the server by running:

```bash
node .
```

This will start the `shell` application in production mode, serving the server-side rendered application.
