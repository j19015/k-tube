import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Card, CardContent, CardMedia,CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const clientUrl = process.env.REACT_APP_CLIENT_URL;
const S3Url=process.env.REACT_APP_S3_ENDPOINT


interface Data {
  status: boolean;
  login_session_status: boolean;
}

interface Data2{
  login_session_status: boolean;
  user_id : number;
}


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

  const [session_user_id,SetSessionUserId] = useState<number>(0);

  const session_confirm = async () => {
    try {
      const res: Response = await fetch(`${clientUrl}/session`,{
        credentials: "include"
      });
      const data: Data2 = await res.json();
      console.log(data);
      SetSessionUserId(data.user_id as number);
      return data.login_session_status;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    fetchVideos();
    session_confirm();
  }, []);

  const change_video_show_status=()=>{
    SetVideoShowStatus(!video_show_status);
    SetVideoShow(null)
  }

  const change_video_show=(video: video)=>{
    SetVideoShowStatus(!video_show_status);
    SetVideoShow(video)
  }

  const delete_video=async(video: video)=>{
    try{
      const res=await fetch(`${clientUrl}/VideoDelete`,{
        credentials: "include",
        method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ video_id: video.id }),
      })
      console.log("動画の削除に成功しました")
      const updatedVideos = videos.filter((v) => v.id !== video.id);
      // 新しい配列をセット
      setVideos(updatedVideos);

    } catch(e){
      console.log("動画の削除に失敗しました");
    }
  }

  const fetchVideos = async () => {
    console.log("動画を取得しました")
    try {
      const response = await fetch(`${clientUrl}/VideoIndex`);
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
      {!video_show_status && video_show == null ? (
        <>
          <Typography variant="h4" sx={{mb:5,mt:5}} >動画一覧</Typography>
          <Typography variant="h5" sx={{mb:5}}>ログインしているユーザIDは{session_user_id}です！</Typography>
          <Typography paragraph>再生したい動画をクリックしてください</Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap="1rem">
            {videos.map((video) => (
              <Card key={video.id} sx={{ maxWidth: 345, marginLeft: 'auto', marginRight: 'auto' }}>
                <CardMedia
                  component="video"
                  src={`${S3Url}/` + video.URL}
                  controls
                  width="100%"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>Title: {video.title}</Typography>
                  <Typography variant="body1" gutterBottom>Description: {video.description}</Typography>
                  <Typography variant="body2">Author: {video.user_id}</Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => change_video_show(video)} sx={{mr:'auto'}}>詳細へ</Button>
                  {(session_user_id == video.user_id) && (
                    <Button onClick={() => delete_video(video)} startIcon={<DeleteIcon />}  variant="contained">削除</Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      ) : (
        video_show && (
          <>
            <Typography variant="h4">動画再生</Typography>
            <Typography paragraph>再生ボタンクリック</Typography>
            <Card>
              <CardMedia
                  component="video"
                  src={`${S3Url}/` + video_show.URL}
                  controls
                  width="100%"
              />
              <CardContent>
                <Typography variant="h6">Title: {video_show.title}</Typography>
                <Typography variant="body1">Description: {video_show.description}</Typography>
                <Typography variant="body2">Author: {video_show.user_id}</Typography>
              </CardContent>
              <CardActions sx={{justifyContent:'center'}}>
                <Button onClick={change_video_show_status} variant="contained" size="medium">一覧へ</Button>
              </CardActions>
            </Card>
          </>
        )
      )}
    </div>
  );
};

export default VideoIndex;
