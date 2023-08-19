FROM node:16-alpine3.17

WORKDIR /usr/ssv-task

COPY yarn.lock package.json ./

RUN yarn install

ADD . ./

RUN yarn build