import React, { useState, useEffect } from 'react';

interface video{
    id: number;
    title: string;
    description: string;
    URL : string;
    user_id : number; 
}
const VideoIndex = () => {
  const [videos, setVideos] = useState<video[]>([]);

  const [video_show, SetVideoShow] = useState<video | null>(null);
  const [video_show_status,SetVideoShowStatus] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const change_video_show_status=()=>{
    SetVideoShowStatus(!video_show_status);
    SetVideoShow(null)
  }

  const change_video_show=(video: video)=>{
    SetVideoShowStatus(!video_show_status);
    SetVideoShow(video)
  }

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:3000/VideoIndex');
      const data = await response.json();
      if (response.ok) {
        setVideos(data.videos);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main">
      {!video_show_status && video_show==null ?(
        <>
            <h1>動画一覧</h1>
            <p>再生したい動画をクリックしてください</p>
            <ul>
                {videos.map((video) => (
                <li className="contents" key={video.id}>
                    <div className="video">
                        <video src={"http://localhost:9090/video-bucket/"+video.URL} controls width="100%"></video>
                    </div>
                    <div>
                        <p>Title: {video.title}</p>
                    </div>
                    <div>
                        <p>Description: {video.description}</p>
                    </div>
                    <div>
                        <p>author: {video.user_id}</p>
                    </div>
                    <div>
                        <button onClick={() => change_video_show(video)}>詳細へ</button>
                    </div>
                </li>
                ))}
            </ul>
        </>
      ):(
        video_show &&(
        <>
            <h1>動画再生</h1>
            <p>再生ボタンクリック</p>
            <div className="video">
                <video src={"http://localhost:9090/video-bucket/"+video_show.URL} controls width="100%"></video>
            </div>
            <div>
                <p>Title: {video_show.title}</p>
            </div>
            <div>
                <p>Description: {video_show.description}</p>
            </div>
            <div>
                <p>author: {video_show.user_id}</p>
            </div>
            <div>
                <button onClick={change_video_show_status}>一覧へ</button>
            </div>
        </>
        )
      )
      }
    </div>
  );
};

export default VideoIndex;
