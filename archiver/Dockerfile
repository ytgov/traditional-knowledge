# Stage 0 - base node customizations
FROM node:20.18.0-alpine3.19 AS base-node

RUN npm install -g npm@10.9.0

# Stage 1 - archiver build - requires development environment because typescript
FROM base-node AS archiver-build-stage

ENV NODE_ENV=development

WORKDIR /usr/src/archiver

COPY ./package*.json ./
COPY ./tsconfig*.json ./
RUN npm install

COPY . .

RUN npm run build


# Stage 3 - production setup
FROM base-node

ARG RELEASE_TAG
ARG GIT_COMMIT_HASH

ENV RELEASE_TAG=${RELEASE_TAG}
ENV GIT_COMMIT_HASH=${GIT_COMMIT_HASH}

# Install dependencies
RUN apk add --no-cache \
  openjdk21 \
  libreoffice \
  curl

# Font configuration (https://stackoverflow.com/questions/56937689/how-to-install-fonts-in-docker)
WORKDIR /root/fonts

RUN apk add --no-cache msttcorefonts-installer fontconfig
RUN update-ms-fonts
RUN apk add ttf-freefont font-terminus font-inconsolata font-dejavu font-noto font-noto-cjk font-awesome font-noto-extra

# Google fonts
RUN wget https://github.com/google/fonts/archive/main.tar.gz -O gf.tar.gz --no-check-certificate
RUN tar -xf gf.tar.gz
RUN mkdir -p /usr/share/fonts/truetype/google-fonts
RUN find $PWD/fonts-main/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1
RUN rm -f gf.tar.gz
RUN fc-cache -f && rm -rf /var/cache/*

# PDF signer
WORKDIR /var/lib

RUN curl --location --output open-pdf-sign.jar https://github.com/open-pdf-sign/open-pdf-sign/releases/latest/download/open-pdf-sign.jar

ENV JAVA_HOME="/usr/lib/jvm/java-21-openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Persists TZ=UTC effect after container build and into container run
# Ensures dates/times are consistently formated as UTC
# Conversion to local time should happen in the UI
ENV TZ=UTC

ENV NODE_ENV=production
USER node

# Load SSL certificates and set permissions
# Copy the private key (readable by root only)
COPY --chown=root:root --chmod=0400 certs/icefog.pem /etc/ssl/private/icefog.pem
# Copy the full chain (read-only for everyone is fine)
COPY --chown=root:root --chmod=0444 certs/fullchain.pem /etc/ssl/certs/fullchain.pem

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY --from=archiver-build-stage --chown=node:node /usr/src/archiver/package*.json ./
RUN npm install && npm cache clean --force --loglevel=error

COPY --from=archiver-build-stage --chown=node:node /usr/src/archiver/dist ./dist/

RUN echo "RELEASE_TAG=${RELEASE_TAG}" >> VERSION
RUN echo "GIT_COMMIT_HASH=${GIT_COMMIT_HASH}" >> VERSION

EXPOSE 3000

COPY --from=archiver-build-stage --chown=node:node /usr/src/archiver/bin/boot-app.sh ./bin/

RUN chmod +x ./bin/boot-app.sh

CMD ["./bin/boot-app.sh"]
