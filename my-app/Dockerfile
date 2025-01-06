FROM node:22-alpine

WORKDIR /app
ENV NODE_PATH=/app

COPY . /app/

RUN npm install
EXPOSE 8000

RUN npm start