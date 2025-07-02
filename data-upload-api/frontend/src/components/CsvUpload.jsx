import React, { useRef, useState } from 'react';
import { Box, Button, Typography, Alert, LinearProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const CsvUpload = ({ auth, onRequireLogin }) => {
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    const file = fileInput.current.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/upload-csv', formData, {
        auth: {
          username: auth.username,
          password: auth.password
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(`Inserted ${res.data.inserted} records.`);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        onRequireLogin();
      } else {
        setError(err.response?.data?.detail || 'Upload failed');
      }
    } finally {
      setUploading(false);
      fileInput.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload CSV File
      </Typography>
      <input
        type="file"
        accept=".csv"
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={() => fileInput.current.click()}
        disabled={uploading}
        sx={{ mb: 2 }}
      >
        Select CSV
      </Button>
      {uploading && <LinearProgress sx={{ my: 2 }} />}
      {result && <Alert severity="success">{result}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default CsvUpload;
