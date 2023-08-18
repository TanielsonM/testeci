FROM node:16-alpine

RUN apk add curl nginx supervisor

RUN rm -rf /etc/nginx

COPY ./resources/supervisor /etc/supervisor

COPY ./resources/nginx /etc/nginx

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY ./ ./

RUN yarn build

CMD ["supervisord", "--nodaemon", "--configuration", "/etc/supervisor/supervisord.conf"]