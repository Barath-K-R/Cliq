FROM node:23.1.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]