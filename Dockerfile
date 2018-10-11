FROM node:8-slim

WORKDIR /startup-mumbai
ENV NODE_ENV development

COPY package.json /startup-mumbai/package.json

RUN npm install --production

COPY .env.example /startup-mumbai/.env.example
COPY . /startup-mumbai

CMD ["npm","start"]

EXPOSE 8080
