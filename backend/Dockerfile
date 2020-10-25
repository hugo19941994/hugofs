FROM node:15-alpine

WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run compile

CMD npm run start
