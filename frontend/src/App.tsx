import React from 'react';

//App.cssをimport
import './App.css';

// 状態維持系
import { useState,useEffect,Fragment } from 'react';

//動画アップロード用form && ビデオ一覧の コンポーネントをimport
import UploadVideoForm from './VideoUpload';
import VideoIndex from './VideoIndex';

//muiパッケージのimport
import { Button, TextField, Typography, Grid, Box } from '@mui/material';

//mui関連CSSまとめてimport
import {AppContainer,FormContainer,ButtonContainer} from './mui'

// interface
import {Data,Data2} from './interface'

function App() {
  // name
  const [uname,setUname]=useState("");
  // password
  const [password,setPassword]=useState("");
  // signin signup
  // trueの時は登録画面,falseの時はログイン画面
  const [sign_status,setSign_status]=useState(true);
  // session
  //falseの時はセッション情報がない,trueの時はセッション情報がある。
  const [session_status,setSession_status]=useState(false);

  // trueの時は登録画面,falseの時はログイン画面
  const [move_upload,setMove_upload]=useState(false);



  const changeSignStatus=()=>{
    setSign_status(!sign_status)
  }


  useEffect(() => {
    const session_confirm = async () => {
      try {
        const res: Response = await fetch("http://localhost:3000/session",{
          credentials: "include"
        });
        const data: Data2 = await res.json();
        console.log(data);
        return data.login_session_status;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    const fetchData = async () => {
      const status = await session_confirm();
      setSession_status(status as boolean);
    };

    fetchData();
  });




  //sign_up
  const signup=async()=>{
    try{
      const res: Response = await fetch("http://localhost:3000/signup",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uname: uname,password: password }),
        credentials: 'include'
      });
      const data: Data = await res.json();
      console.log(data.status);
    }catch(e){
      console.log(e);
    }
  }

  //sign_in
  const signin=async()=>{
    try{
      const res: Response = await fetch("http://localhost:3000/signin",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uname: uname,password: password }),
        credentials: 'include'
      });
      const data: Data = await res.json();
      console.log(data.status);
      if(data.status as any==1){
        setSession_status(true);
      }
    }catch(e){
      console.log(e);
    }
  }

  const upload = () => {
    setMove_upload(true);
  }
  

  return (
    <>
      <AppContainer>
      {session_status ? (
        <>
          {!move_upload && (
            <>
              <Button variant="contained" onClick={upload} sx={{mb:5}}>
                動画をアップロードする
              </Button>
            </>
          )}
          {move_upload && <UploadVideoForm></UploadVideoForm>}
          <VideoIndex></VideoIndex>
        </>
      ) : (
        <>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            {!sign_status ? (
              <>
                <Typography variant='h3' sx={{mb:5}}>ログイン画面</Typography>
                <FormContainer>
                  <TextField
                    label="ユーザー名"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  />
                  <TextField
                    type="password"
                    label="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <ButtonContainer>
                    <Button variant="contained" onClick={signin}>
                      ログイン
                    </Button>
                    <Button onClick={changeSignStatus}>アカウント登録ページへ</Button>
                  </ButtonContainer>
                </FormContainer>
              </>
            ) : (
                <>
                  <Typography variant='h3' sx={{mb:5}}>アカウント登録画面</Typography>
                  <FormContainer>
                    <TextField
                      label="ユーザー名"
                      value={uname}
                      onChange={(e) => setUname(e.target.value)}
                    />
                    <TextField
                      type="password"
                      label="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <ButtonContainer>
                      <Button variant="contained" onClick={signup}>
                        登録
                      </Button>
                      <Button onClick={changeSignStatus}>ログインページへ</Button>
                    </ButtonContainer>
                  </FormContainer>
                </>
            )}
          </Grid>
        </Grid>
        </>
      )}
      <Typography>{session_status}</Typography>
    </AppContainer>
    </>
  );
  
}

export default App;
