FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add @nestjs/cli

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
