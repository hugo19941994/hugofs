FROM node:20-alpine

RUN apk --no-cache add python3 make build-base

WORKDIR /app
COPY *.json /app/

RUN npm install

COPY *.ts /app/
RUN npm run compile

COPY posts posts

CMD npm run start
