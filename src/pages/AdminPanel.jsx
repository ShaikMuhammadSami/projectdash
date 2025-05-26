// File: src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Container, Typography, TextField, Button, Grid, Card, CardContent,
  CardActions, IconButton, Menu, MenuItem, Box
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { signOut } from 'firebase/auth';

function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', primary: '', secondary: '', teamLead: '', logoUrl: '' });
  const [editId, setEditId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = auth.currentUser;

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async () => {
    if (editId) {
      await updateDoc(doc(db, 'projects', editId), form);
      setEditId(null);
    } else {
      await addDoc(collection(db, 'projects'), form);
    }
    setForm({ name: '', primary: '', secondary: '', teamLead: '', logoUrl: '' });
    fetchProjects();
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      primary: project.primary,
      secondary: project.secondary,
    //   tertiary: project.tertiary,
      teamLead: project.teamLead,
      logoUrl: project.logoUrl
    });
    setEditId(project.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Admin Panel</Typography>
        <div>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} margin="normal" />
          <TextField fullWidth label="Primary Support" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} margin="normal" />
          <TextField fullWidth label="Secondary Support" value={form.secondary} onChange={(e) => setForm({ ...form, secondary: e.target.value })} margin="normal" />
          {/* <TextField fullWidth label="Tertiary Support" value={form.tertiary} onChange={(e) => setForm({ ...form, tertiary: e.target.value })} margin="normal" /> */}
          <TextField fullWidth label="Team Lead" value={form.teamLead} onChange={(e) => setForm({ ...form, teamLead: e.target.value })} margin="normal" />
          <TextField fullWidth label="Logo Image URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} margin="normal" />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} style={{ marginTop: 16 }}>
            {editId ? 'Update Project' : 'Add Project'}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          {projects.map(p => (
            <Card key={p.id} style={{ marginBottom: 12 }}>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography>Primary: {p.primary}</Typography>
                <Typography>Secondary: {p.secondary}</Typography>
                {/* <Typography>Tertiary: {p.tertiary}</Typography> */}
                <Typography>Team Lead: {p.teamLead}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(p)} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(p.id)} color="error"><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPanel;
