import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';
import { PassThrough } from 'stream';
import { Sign } from 'crypto';
import userEvent from '@testing-library/user-event';

interface Data {
  status: boolean;
  login_session_status: boolean;
}

interface Data2{
  login_session_status: boolean;
}

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

  // const session_confirm = async () => {
  //   try {
  //     const res: Response = await fetch("http://localhost:3000/session");
  //     const data: Data = await res.json();
  //     return data.login_session_status;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // };

  // // ページにアクセスしてきた時に実行
  // session_confirm().then((status) => {
  //   setSession_status(status !== null ? false : true);
  // });
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
  

  return (
    <div className="App">
      {session_status ? (
        <p>video一覧</p>
      ) : (
        sign_status ? (
          <>
            uname: <input value={uname} onChange={e => setUname(e.target.value)}></input><br />
            password: <input value={password} onChange={e => setPassword(e.target.value)}></input><br />
            <button onClick={signin}>ログイン</button>
          </>
        ) : (
          <>
            uname: <input value={uname} onChange={e => setUname(e.target.value)}></input><br />
            password: <input value={password} onChange={e => setPassword(e.target.value)}></input><br />
            <button onClick={signup}>登録</button>
          </>
        )
      )}
      <p>{session_status}</p>
    </div>
  );
  
}

export default App;
