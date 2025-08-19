# Deployment

This section provides information on how the applications are deployed.

## Docker

The applications are designed to be deployed as Docker containers. The project contains two Dockerfiles:

- `Dockerfile.shell`: This Dockerfile is used to build the Docker image for the `shell` application.
- `Dockerfile.content`: This Dockerfile is used to build the Docker image for the `content` application.

To build a Docker image for an application, run the following command:

```bash
docker build --tag node-[APP] -f Dockerfile.[APP] .
```

Replace `[APP]` with either `shell` or `content`.

To run an application as a Docker container, run the following command:

```bash
docker run -d -p [PORT]:[PORT] node-[APP]
```

Replace `[PORT]` with the port number for the application (e.g., `3030` for the `shell` application) and `[APP]` with either `shell` or `content`.

## Docker Compose

The project also includes a `docker-compose.yml` file that can be used to run both applications at the same time.

To start the applications using Docker Compose, run the following command:

```bash
docker-compose up
```

This will build the Docker images for both applications (if they don't already exist) and start the containers.
