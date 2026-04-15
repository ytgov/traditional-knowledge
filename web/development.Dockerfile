FROM node:20.18.0-alpine3.19

RUN npm install -g npm@11.12.1

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm clean-install

COPY . .

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
