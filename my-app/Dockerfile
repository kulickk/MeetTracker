FROM node:latest

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install react-scripts
RUN npm update

COPY . /app/
RUN npm run build
RUN npm install -g serve


CMD ["serve", "-s", "build"]