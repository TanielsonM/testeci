FROM node:16-alpine

RUN apk add curl

WORKDIR /app

COPY .output/ /app/

CMD [ "node", "server/index.mjs" ]