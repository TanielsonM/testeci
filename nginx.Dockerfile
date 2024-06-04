FROM nginx:1.24.0-alpine

RUN apk update && apk upgrade

RUN apk add curl

RUN rm -rf /etc/nginx

COPY resources/nginx/config /etc/nginx

COPY resources/nginx/config/nginx.conf /etc/nginx/nginx.conf
