FROM node:14-alpine
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build:ssr

CMD npm run start
