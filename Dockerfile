FROM node:16-alpine

RUN apk add curl

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY ./ ./

RUN yarn build

CMD [ "node", "--require", "dd-trace/init", ".output/server/index.mjs" ]