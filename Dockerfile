FROM docker.io/node:lts-alpine

COPY . /server

WORKDIR /server

RUN npm i

CMD ["npm", "run", "start"]
