#!/bin/sh
# コンテナ起動時に実行されるスクリプト

npm install

# nodemonで起動する
# ソースコードの変更を検知して再起動される
# 対象ディレクトリ: src
# 対象拡張子: ts

exec node_modules/.bin/nodemon --watch src -e ts --ignore "src/__tests__/*" --exec "npm run server"
