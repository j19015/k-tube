import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const UploadVideoForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', selectedFile as File);
      formData.append('title', title);
      formData.append('description', description);

      await fetch('http://localhost:3000/videoUpload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      // アップロード成功の処理
      console.log('動画がアップロードされました。',selectedFile);
    } catch (error) {
      // エラーの処理
      console.error('動画のアップロードに失敗しました。', error);
    }
  };

  return (
    <div>
      タイトル:
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br></br>
      概要:
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br></br>
      <input 
        type="file" 
        onChange={handleFileChange} 
      /><br></br>
      <button onClick={handleUpload}>動画をアップロード</button>


    </div>
  );
};

export default UploadVideoForm;
