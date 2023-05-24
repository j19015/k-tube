# フロントエンド用Dockerfile

# Node.jsのイメージをベースにする
FROM node:14-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY src/ .

# フロントエンドのビルド
RUN npm run build

# ポートの公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "start"]
