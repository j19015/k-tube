# ECS デプロイ用コンテナ
FROM node:18

WORKDIR /opt/app

# バックエンドのビルド
COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY src src
RUN npm run build

# フロントエンドのビルド
COPY frontend frontend
RUN cd frontend \
  && npm install \
  && npm run build \
  && cd .. \
  && cp -r frontend/build public \
  && rm -rf frontend

# サーバ起動
ENV SERVER_PORT 80
ENV DB_TYPEORM_ENTITIES=dist/entity/*.js

EXPOSE 80
CMD [ "node", "dist/app.js" ]
