import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { PassThrough } from 'stream';

interface Data {
  text: string;
}

function App() {
  const [text,setText]= useState("");
  const [uname,setUname]=useState("");
  const [password,setPassword]=useState("");
  const temp=async()=>{
    try{
      const res: Response = await fetch("http://localhost:3000/count");
      const data: Data = await res.json();
      console.log(data["text"]);
      setText(data["text"]);
      console.log("うまくいってそう");
    }catch(e){
      console.log(e);
    }
  }

  const signup=async()=>{
    try{
      const res: Response = await fetch("http://localhost:3000/signup",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uname: uname,password: password }),
      });
      const data: Data = await res.json();
      console.log(data);
      console.log("登録うまくいってそう");
    }catch(e){
      console.log(e);
    }
  }

  return (
    <div className="App">
      <button onClick={temp}>Fetch Count</button>
      <p>{text}</p>
      uname: <input value={uname} onChange={e=>setUname(e.target.value)}></input><br/>
      password: <input value={password} onChange={e=>setPassword(e.target.value)}></input><br/>
      <button onClick={signup}>登録</button>
    </div>
  );
}

export default App;
