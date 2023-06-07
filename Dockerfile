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

ENV REACT_APP_CLIENT_URL="https://hayashida.ng-training.vcube.net"
ENV REACT_APP_S3_ENDPOINT="s3://arn:aws:s3:ap-northeast-1:986037367559:accesspoint/hayashida-access-point"

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
