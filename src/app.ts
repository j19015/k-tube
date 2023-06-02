import 'reflect-metadata';
import { json } from 'body-parser';
import * as env from "./env";

import express from 'express';
import { DataSource } from 'typeorm';
//session

import { Redis } from 'ioredis';
import  session  from "express-session";
import connectRedis from "connect-redis";

import { HeadObjectCommand, S3Client,PutObjectCommand } from '@aws-sdk/client-s3';
import { User } from './entity/User';
import { isLeepYear } from './sample';

import cors from 'cors';

//動画受け取り用
import multer from 'multer';
import { Video } from './entity/Video';

// multerの設定
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 最大ファイルサイズ (10MB)
  },
});

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

const allowedOrigins = ['http://localhost:3000','http://localhost:3001']; // クライアントのホスト名を追加
dataSource.initialize().then(() => {
  const app = express();
  //CORSの許可
  app.use(cors({
    credentials: true,
    origin: allowedOrigins,
  }
  ));

  // RedisStoreの初期化
  const RedisStore = connectRedis(session);

app.use(
  session({
    //クッキーの名前を指定。ここではセッションクッキーの名前を "qid" に設定。
    name: "qid",
    // セッションデータの永続化にRedisを使用するための設定。
    // clientにはRedisクライアントが指定されており、既存のRedisクライアントを使用する場合に渡されます。
    // disableTouchは省略可能なオプションで、セッションの有効期限の更新を無効にするかどうかを指定します。
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    cookie: {
      //domain: "localhost:3001",
      //path: "/",
      // maxAgeはクッキーの有効期限をミリ秒単位で指定します。ここでは10年に設定されています。
      // httpOnlyはセッションクッキーをJavaScriptからアクセスできないようにするかどうかを指定します。
      // sameSiteはクッキーのSameSite属性を指定します。ここでは "lax" に設定されており、クロスサイトリクエストの際にはクッキーが送信されることができます。
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // クッキーの有効期限（10年）
      httpOnly: true,
      sameSite: "lax",
      //secureオプションがtrueに設定されている場合、クライアントがセキュアな接続（HTTPS）を使用している場合にのみ、セッションクッキーが送信されます。これにより、通信が暗号化されており、盗聴やクッキーの傍受による攻撃を防ぐことができます。
      //一旦false
      //
      secure: false,
    },
    //未初期化のセッションを保存するかどうかを指定します。ここではfalseに設定されており、未初期化のセッションは保存されません。
    saveUninitialized: false,
    //セッションの署名に使用するシークレットキーを指定します。セッションデータの改ざんを防ぐために必要です。
    secret: "your-secret-key",
    //セッションストアにセッションデータを保存する必要がない場合にfalseに設定します。
    resave: false,
  })
);

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
      const user = await userRepository.findOne({ where: { uname }, select: ['id','uname','password']  });
      console.log(user)
  
      if (!user) {
        // ユーザーが存在しない場合はログイン失敗として処理する
        res.json({ status: 0 }).end();
        return;
      }
  
      if (user.password !== password) {
        // パスワードが一致しない場合もログイン失敗として処理する
        res.json({ status: 0 }).end();
        return;
      }
      // ログイン成功時の処理をここに記述する
      (req.session as any).user = user;
      //console.log(req.session)
      //sessionについて

      //keyとともにredisにsession情報をValueとして保存

      //秘密鍵でkeyを暗号化し、cookieとして送信

      //ブラウザに暗号化したkeyを保存
      
  
      res.json({ status: 1 }).end();
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: 'Failed to perform login' }).end();
      res.json({ status: 0 }).end();
    }
  });

  //sessionが成功してるかどうか
  app.get('/session', (req, res) => {
    const user = (req.session as any).user; // セッションからユーザー情報を取得
    //console.log(req.session);
    if (user) {
      res.json({ login_session_status: true,user_id: user.id }).end();
    } else {
      res.json({ login_session_status: false }).end();
    }
  });
  const port = env.SERVER_PORT;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  //画像上げるよう
  app.post('/videoUpload', upload.single('video'), async (req, res) => {
    const bucket = env.S3_BUCKET;
    // 現在の時間を取得
    const currentTime = new Date().getTime();
    
    //pathを作成
    const path = 'video_'+currentTime+".mp4"; // 保存先のS3パスやファイル名を適宜変更してください
  
    try {
      if (!req.file) {
        // ファイルがアップロードされていない場合の処理
        res.json({ status: 0 }).end();
        return;
      }
  
      const uploadParams = {
        Bucket: bucket,
        Key: path,
        Body: req.file.buffer, // req.file.buffer() を使用する
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      
      //アップロードがうまくいったときの処理
      const videoRepository = dataSource.getRepository(Video);
      try {
        const video = new Video()
        video.URL=path;
        video.title = req.body.title;
        video.description = req.body.description;
        const user = (req.session as any).user; // セッションからユーザー情報を取得
        video.user=user
    
        // エンティティをデータベースに保存
        await dataSource.manager.save(video);
    
      } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Failed to save user' }).end();
        res.json({ status: 0 }).end();
      }
    } catch (error) {
      console.error(error);
      res.json({ status: 0 }).end();
    }
  });
  //Video一覧
  app.get('/VideoIndex', async (req, res) => {
    try {
      const videoRepository = dataSource.getRepository(Video);
      const videos = await videoRepository.find();
      res.json({ videos: videos }).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch videos' }).end();
    }
  });

  app.delete("/VideoDelete",async(req,res)=>{
    try {
      const videoId = req.body.video_id;
      const videoRepository = dataSource.getRepository(Video);
      const video = await videoRepository.findOne({ where: { id: videoId } });
      if (!video) {
        res.json({ status: 0, message: "Video not found" }).end();
        return;
      }
  
      await videoRepository.remove(video);
  
      res.json({ status: 1, message: "Video deleted successfully" }).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete video" }).end();
    }
  });

})
