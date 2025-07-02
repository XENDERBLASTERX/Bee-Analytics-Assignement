import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', age: '', email: '' });

  // For authentication (replace with your actual auth state if needed)
  const [auth] = useState({
    username: localStorage.getItem('username') || 'admin',
    password: localStorage.getItem('password') || 'secret',
  });

  const fetchRows = async () => {
    setLoading(true);
    let url = 'http://localhost:8000/data?';
    let params = [];
    if (filters.name) params.push(`name=${encodeURIComponent(filters.name)}`);
    if (filters.age) params.push(`age=${encodeURIComponent(filters.age)}`);
    if (filters.email) params.push(`email=${encodeURIComponent(filters.email)}`);
    url += params.join('&');
    try {
      const res = await axios.get(url);
      setRows(res.data);
    } catch {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRows();
  };

  // Delete row by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://localhost:8000/data/${id}`, {
        auth: {
          username: auth.username,
          password: auth.password
        }
      });
      setRows(rows.filter(row => row.id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Uploaded Data</Typography>
      <form
        onSubmit={handleFilterSubmit}
        style={{ display: 'flex', alignItems: 'center', margin: '16px' }}
      >
        <TextField
          label="Filter by Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          sx={{ mr: 2 }}
        />
        <TextField
          label="Filter by Age"
          name="age"
          value={filters.age}
          onChange={handleFilterChange}
          size="small"
          sx={{ mr: 2 }}
        />
        <TextField
          label="Filter by Email"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          size="small"
          sx={{ mr: 2 }}
        />
        <Button type="submit" variant="contained">Filter</Button>
      </form>
      {loading ? (
        <CircularProgress sx={{ m: 2 }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default DataTable;
