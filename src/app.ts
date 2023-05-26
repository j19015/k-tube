import 'reflect-metadata';
import { json } from 'body-parser';
import * as env from "./env";

import express from 'express';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { User } from './entity/User';
import { isLeepYear } from './sample';

const publicDir = __dirname + '/../public/';

const dataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [env.DB_TYPEORM_ENTITIES],
  logging: true,
  synchronize: true,
});

const redisClient = new Redis(env.REDIS_PORT, env.REDIS_HOST, { db: env.REDIS_DB });

const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT, // S3ローカルモックのエンドポイント
  forcePathStyle: !!env.S3_ENDPOINT, // S3ローカルモック使用時はtrue
});

dataSource.initialize().then(() => {
  const app = express();
  //CORSの許可
  const cors = require('cors');
  app.use(cors());
  app.use('/', json());
  app.use(express.static(publicDir)); // 静的ファイル返す用

  app.get('/db', async (req, res) => {
    const userRepository = dataSource.getRepository(User);
    const count = await userRepository.count();
    res.json({ result: count }).end();
  });

  app.get('/redis', async (req, res) => {
    const key = "hoge";
    const value = await redisClient.get(key);
    res.json({ result: value }).end();
  });

  app.get('/s3', async (req, res) => {
    const bucket = env.S3_BUCKET;
    const path = "test.txt";
    let size = null;
    try {
        const output = await s3Client.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: path,
        }));
        size = output.ContentLength;
    } catch(error) {
        console.error(error);
    }

    res.json({ result: size }).end();
  });

  app.post('/leapyear', (req, res) => {
    const inputYear = req.body.year;
    if (Number.isSafeInteger(inputYear)) {
      const result = isLeepYear(inputYear);
      res.json({ result: result }).end();
    } else {
      res.sendStatus(400).end();
    }
  });

  
  //作成

  app.post('/signup', async(req, res) => {

    const userRepository = dataSource.getRepository(User);
    try {
      const user = new User();
      user.uname = req.body.uname;
      user.password = req.body.password;
  
      // エンティティをデータベースに保存
      await dataSource.manager.save(user);
  
      res.json({ status: 1 }).end();
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: 'Failed to save user' }).end();
      res.json({ status: 0 }).end();
    }
  });

  app.post('/signin', async (req, res) => {
    const { uname, password } = req.body;
  
    try {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { uname }, select: ['password']  });
  
      if (!user) {
        // ユーザーが存在しない場合はログイン失敗として処理する
        //res.status(401).json({ error: 'Invalid credentials' }).end();
        res.json({ status: 0 }).end();
        return;
      }
  
      if (user.password !== password) {
        // パスワードが一致しない場合もログイン失敗として処理する
        //res.status(401).json({ error: 'Invalid credentials' }).end();
        res.json({ status: 0 }).end();
        return;
      }
  
      // ログイン成功時の処理をここに記述する
  
      res.json({ status: 1 }).end();
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: 'Failed to perform login' }).end();
      res.json({ status: 0 }).end();
    }
  });

  const port = env.SERVER_PORT;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})
