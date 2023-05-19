FROM node:18

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV SERVER_PORT 80
ENV DB_TYPEORM_ENTITIES=dist/entity/*.js

EXPOSE 80
CMD [ "node", "dist/app.js" ]
