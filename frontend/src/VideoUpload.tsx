import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const UploadVideoForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', selectedFile as File);

      await fetch('http://localhost:3000/videoUpload', {
        method: 'POST',
        body: formData,
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
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>動画をアップロード</button>
    </div>
  );
};

export default UploadVideoForm;
