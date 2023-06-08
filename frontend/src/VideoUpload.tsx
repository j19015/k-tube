import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Typography,Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css'
const clientUrl = process.env.REACT_APP_CLIENT_URL;

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

      await fetch(`${clientUrl}/videoUpload`, {
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
    <>
      <Typography variant="h4">動画投稿</Typography>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        margin: '2rem',
      }}
      >
      <TextField
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="概要"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} endIcon={<SendIcon />}>
        アップロード
      </Button>
    </Box>
    </>
  );
};

export default UploadVideoForm;
