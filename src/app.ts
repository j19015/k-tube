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
  const cors = require('cors');
  app.use(cors());
  app.use('/', json());
  app.use(express.static(publicDir)); // 静的ファイル返す用

  app.get('/hello', (req, res) => {
    console.log("aaaaa")
    res.json({ result: "hello" }).end();
  });

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

  
  //とりあえず
  app.get('/count', (req, res) => {
    console.log("aaaaa");
    res.json({ text: "山本" }).end();
  });

  app.post('/signup', async(req, res) => {
    console.log("aaaaa");
    const userRepository = dataSource.getRepository(User);
    try {
      const user = new User();
      user.uname = req.body.uname;
      user.password = req.body.password;
  
      // エンティティをデータベースに保存
      await dataSource.manager.save(user);
  
      res.json({ uaname: user.uname }).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save user' }).end();
    }
    //res.json({uname: req.body.uname,password: req.body.password}).end();
  });

  const port = env.SERVER_PORT;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})
