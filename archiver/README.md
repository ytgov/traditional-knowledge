# Archiver Service

## Building Production Image Locally

1. From the top level of the repository, run the docker-compose.yml file:
   ```bash
   docker compose build \
     --build-arg RELEASE_TAG="$(date +%Y.%m.%d)" \
     --build-arg GIT_COMMIT_HASH="$(git rev-parse HEAD)"
   ```
