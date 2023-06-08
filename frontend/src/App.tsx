import React from 'react';

//コンポーネント
import Header from './header/Header';

//App.cssをimport
import './App.css';

// 状態維持系
import { useState,useEffect,Fragment } from 'react';

//動画アップロード用form && ビデオ一覧の コンポーネントをimport
import UploadVideoForm from './VideoUpload';
import VideoIndex from './VideoIndex';

//muiパッケージのimport
import { Button, TextField, Typography, Grid, Box,Snackbar } from '@mui/material';

//mui関連CSSまとめてimport
import {AppContainer,FormContainer,ButtonContainer} from './mui'

// interface
import {Data,Data2} from './interface'


const clientUrl = process.env.REACT_APP_CLIENT_URL;

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

  //バリデーション
  const [unameerror, setUnameerror]=useState(false);
  const [passworderror, setPassworderror]=useState(false);

  //backendバリデーション
  const [backend_error, setBackendrror]=useState("");

  //snackbar用 signup
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const changeSignStatus=()=>{
    setSign_status(!sign_status)
  }
  const handleSnackbarClose = () => {
    setErrorPopup(false);
  };

  const fetchData = async () => {
    const status = await session_confirm();
    setSession_status(status as boolean);
  };
  const session_confirm = async () => {
    try {
      const res: Response = await fetch(`${clientUrl}/session`,{
        credentials: "include"
      });
      const data: Data2 = await res.json();
      console.log(data);
      return data.login_session_status;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    session_confirm();
    fetchData();
  },[]);


  //sign_up
  const signup=async()=>{
    try{
      const res: Response = await fetch(`${clientUrl}/signup`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uname: uname,password: password }),
        credentials: 'include'
      });
      const data: Data = await res.json();
      console.log(data.message);
      setBackendrror(data.message);
      setErrorPopup(true);
    }catch(e){
      console.log(e);
    }
  }

  //sign_in
  const signin=async()=>{
    try{
      const res: Response = await fetch(`${clientUrl}/signin`,{
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
      }else{
        setErrorPopup(true);
      }
    }catch(e){
      console.log(e);
    }
  }

  const upload = () => {
    setMove_upload(true);
  }


  const [unameerrormessage, setUnameerrormessage]=useState("");
  const [passerrormessage, setPasserrormessage]=useState("");

 // ユーザー名エラー
  useEffect(() => {
    if (uname.length>8){
      setUnameerror(true);
      console.error('入力は8文字以下にしてください')
    }
    else{
      setUnameerror(false);
    }

    return () => {
      setUnameerrormessage("ユーザー名が正しくありません")
    };
  }, [uname]);

  // パスワード
  useEffect(() => {
    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;
    if (!regex.test(password)){
      setPassworderror(true);
      console.error('error')
    } else{
      setPassworderror(false);
    }

    return () => {
      setPasserrormessage("英数字8文字以上で入力してください")
    };
  }, [password]);


  // ヘッダーからの画面切り替え
  useEffect(() => {

    return () => {
      setPasserrormessage("英数字8文字以上で入力してください")
    };
  }, [password]);


  //コールバック関数
  const handleChildStateChange = (childState: any) => {
    setSign_status(childState);
  };

  const handleChildSessionChange = (childState: any) => {
    setSession_status(false);
  };

  return (
    <>
      <Header 
        onChildStateChange={handleChildStateChange} 
        onChildSessionChange={handleChildSessionChange} 
        onUploadButtonClicked={() => {setMove_upload(!move_upload);} } 
        session_status={session_status} 
        onSessionButtonClicked={() => {setSession_status(false);} }
        onSignInButtonClicked={()=>{setSign_status(false) }}
        onSignUpButtonClicked={()=>{setSign_status(true) }}
        />
      <AppContainer>
      {session_status ? (
        <>
          {!move_upload && (
            <>
              {/* <Button variant="contained" onClick={upload} sx={{mb:5}}>
                動画をアップロードする
              </Button> */}
            </>
          )}
          {move_upload && <UploadVideoForm></UploadVideoForm>}
          <VideoIndex></VideoIndex>
        </>
      ) : (
        <>
        <Grid container direction="column" alignItems="center" className="signmain">
          <Grid item>
            {!sign_status ? (
              <>
                <Typography variant='h4' sx={{mb:5}}>ログイン画面</Typography>
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
                <Snackbar
                open={errorPopup}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                message={
                  <>
                    ログインに失敗しました。
                    <br />
                    ユーザ名,パスワードを再確認してください
                  </>
                }
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              />
              </>
            ) : (
                <>
                  <Typography variant='h4' sx={{ mb: 5 }}>アカウント登録</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="ユーザー名"
                        value={uname}
                        onChange={(e) => setUname(e.target.value)}
                        fullWidth
                      />
                      {unameerror && <Typography color="error">{unameerrormessage}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        label="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                      />
                      {passworderror && <Typography color="error">{passerrormessage}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" onClick={signup}>
                        登録
                      </Button>
                      <Button onClick={changeSignStatus}>ログインページへ</Button>
                    </Grid>
                  </Grid>
                  <Snackbar
                    open={errorPopup}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    message={backend_error}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                  />
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
