// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  Container, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar, IconButton,
  Menu, MenuItem, Box
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const values = Object.values(p).join(' ').toLowerCase();
    return values.includes(filter.toLowerCase());
  });

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
        <Typography variant="h4">Project Dashboard</Typography>
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

      <TextField
        label="Search Your Projects"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>S.No</strong></TableCell>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>Project Name</strong></TableCell>
              <TableCell><strong>Primary</strong></TableCell>
              <TableCell><strong>Secondary</strong></TableCell>
              {/* <TableCell><strong>Tertiary</strong></TableCell> */}
              <TableCell><strong>Team Lead</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {project.logoUrl && (
                    <Avatar
                      alt="Project Logo"
                      src={project.logoUrl}
                      variant="square"
                      sx={{ width:100 }}
                    />
                  )}
                </TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.primary}</TableCell>
                <TableCell>{project.secondary}</TableCell>
                {/* <TableCell>{project.tertiary}</TableCell> */}
                <TableCell>{project.teamLead}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Dashboard;