FROM node:24.21 AS builder

WORKDIR /Hybrid_analyzer_fr

COPY package.json yarn.lock* package-lock.json* ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]