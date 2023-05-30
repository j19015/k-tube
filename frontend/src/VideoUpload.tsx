import React, { useState, ChangeEvent } from 'react';
import './App.css'


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
      formData.append('video', selectedFile as any);

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
    <>
    <header>

    </header>
    <div className="main">
      <h1>動画アップロード</h1>

      <input type="file" className="form-control" onChange={handleFileChange} />
      <button className="btn" onClick={handleUpload}>動画をアップロード</button>
    </div>
    </>
  );
};

export default UploadVideoForm;
