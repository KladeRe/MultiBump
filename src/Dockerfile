FROM node:20-alpine

WORKDIR /usr/local/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5228

CMD ["npm", "run", "start"]