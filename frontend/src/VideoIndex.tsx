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

  useEffect(() => {
    fetchVideos();
  }, []);

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
    <div>
      <h2>Video List</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <p>Title: {video.title}</p>
            <p>Description: {video.description}</p>
            <video src={"http://localhost:9090/video-bucket/"+video.URL} controls></video>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoIndex;
