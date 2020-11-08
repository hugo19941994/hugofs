FROM node:15-alpine

WORKDIR /app
COPY package*.json /app/

RUN apk --no-cache add python3 make build-base
RUN npm install

COPY . /app
RUN npm run compile

CMD npm run start
