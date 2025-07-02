import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import CsvUpload from './components/CsvUpload';
import DataTable from './components/DataTable';
import LoginDialog from './components/LoginDialog';

function App() {
  const [auth, setAuth] = useState({ username: '', password: '', loggedIn: false });

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Data Upload & Query Portal
        </Typography>
        <Box sx={{ my: 3 }}>
          <CsvUpload auth={auth} onRequireLogin={() => setAuth({ ...auth, loggedIn: false })} />
        </Box>
        <Box sx={{ my: 3 }}>
          <DataTable />
        </Box>
      </Paper>
      <LoginDialog open={!auth.loggedIn} setAuth={setAuth} />
    </Container>
  );
}

export default App;
