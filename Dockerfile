FROM node:16-alpine

WORKDIR /app

COPY .output/ /app/

CMD [ "node", "server/index.mjs" ]