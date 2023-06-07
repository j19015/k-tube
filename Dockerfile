# ECS デプロイ用コンテナ
FROM node:18

WORKDIR /opt/app

# バックエンドのビルド
COPY package*.json ./

ENV REDIS_HOST="hayashida-elc.iqnt9o.clustercfg.apne1.cache.amazonaws.com"

RUN npm install

COPY tsconfig.json ./
COPY src src
RUN npm run build

ENV CORS_ORIGIN = true
ENV REACT_APP_CLIENT_URL="https://hayashida.ng-training.vcube.net"
ENV REACT_APP_S3_ENDPOINT="https://hayashida-bucket.s3.ap-northeast-1.amazonaws.com/1/hayashida-bucket"

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
