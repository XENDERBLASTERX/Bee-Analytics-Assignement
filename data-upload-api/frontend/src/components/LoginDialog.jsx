import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material';

const LoginDialog = ({ open, setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Try a dummy request to protected endpoint
    const res = await fetch('http://localhost:8000/data', {
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password)
      }
    });
    if (res.ok || res.status === 200) {
      setAuth({ username, password, loggedIn: true });
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          fullWidth
          variant="standard"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin} variant="contained">Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
