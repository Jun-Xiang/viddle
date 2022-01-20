FROM node:16

WORKDIR /viddle-server

COPY . .

RUN npm install

CMD ["node", "server"]