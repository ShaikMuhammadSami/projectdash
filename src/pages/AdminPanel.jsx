// // File: src/pages/AdminPanel.jsx
// import React, { useEffect, useState } from 'react';
// import { db, auth } from '../firebase/config';
// import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// import {
//   Container, Typography, TextField, Button, Grid, Card, CardContent,
//   CardActions, IconButton, Menu, MenuItem, Box
// } from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { signOut } from 'firebase/auth';

// function AdminPanel() {
//   const [projects, setProjects] = useState([]);
//   const [form, setForm] = useState({ name: '', primary: '', secondary: '', teamLead: '', logoUrl: '' });
//   const [editId, setEditId] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const user = auth.currentUser;

//   const fetchProjects = async () => {
//     const querySnapshot = await getDocs(collection(db, 'projects'));
//     const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setProjects(data);
//   };

//   useEffect(() => { fetchProjects(); }, []);

//   const handleSubmit = async () => {
//     if (editId) {
//       await updateDoc(doc(db, 'projects', editId), form);
//       setEditId(null);
//     } else {
//       await addDoc(collection(db, 'projects'), form);
//     }
//     setForm({ name: '', primary: '', secondary: '', teamLead: '', logoUrl: '' });
//     fetchProjects();
//   };

//   const handleEdit = (project) => {
//     setForm({
//       name: project.name,
//       primary: project.primary,
//       secondary: project.secondary,
//     //   tertiary: project.tertiary,
//       teamLead: project.teamLead,
//       logoUrl: project.logoUrl
//     });
//     setEditId(project.id);
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, 'projects', id));
//     fetchProjects();
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     window.location.href = '/';
//   };

//   return (
//     <Container>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h4">Admin Panel</Typography>
//         <div>
//           <IconButton onClick={handleMenuOpen} color="inherit">
//             <AccountCircle fontSize="large" />
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem disabled>{user?.email}</MenuItem>
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//           </Menu>
//         </div>
//       </Box>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <TextField fullWidth label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} margin="normal" />
//           <TextField fullWidth label="Primary Support" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} margin="normal" />
//           <TextField fullWidth label="Secondary Support" value={form.secondary} onChange={(e) => setForm({ ...form, secondary: e.target.value })} margin="normal" />
//           {/* <TextField fullWidth label="Tertiary Support" value={form.tertiary} onChange={(e) => setForm({ ...form, tertiary: e.target.value })} margin="normal" /> */}
//           <TextField fullWidth label="Team Lead" value={form.teamLead} onChange={(e) => setForm({ ...form, teamLead: e.target.value })} margin="normal" />
//           <TextField fullWidth label="Logo Image URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} margin="normal" />
//           <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} style={{ marginTop: 16 }}>
//             {editId ? 'Update Project' : 'Add Project'}
//           </Button>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           {projects.map(p => (
//             <Card key={p.id} style={{ marginBottom: 12 }}>
//               <CardContent>
//                 <Typography variant="h6">{p.name}</Typography>
//                 <Typography>Primary: {p.primary}</Typography>
//                 <Typography>Secondary: {p.secondary}</Typography>
//                 {/* <Typography>Tertiary: {p.tertiary}</Typography> */}
//                 <Typography>Team Lead: {p.teamLead}</Typography>
//               </CardContent>
//               <CardActions>
//                 <IconButton onClick={() => handleEdit(p)} color="primary"><EditIcon /></IconButton>
//                 <IconButton onClick={() => handleDelete(p.id)} color="error"><DeleteIcon /></IconButton>
//               </CardActions>
//             </Card>
//           ))}
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default AdminPanel;
// Modular Admin Panel with Drag-and-Drop and Enhanced UI

// File: src/pages/AdminPanel.jsx
// File: src/pages/AdminPanel.jsx
// File: src/pages/AdminPanel.jsx
// File: src/pages/AdminPanel.jsx
// File: src/pages/AdminPanel.jsx
// File: src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  Container, Typography, IconButton, Menu, MenuItem,
  Box, Grid, Button, Snackbar, Dialog, DialogTitle, DialogActions
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ProjectModal from '../pages/ProjectModal';
import TeamList from '../pages/TeamList';
import ProjectCard from '../pages/ProjectCard';

function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const user = auth.currentUser;

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchEmployees = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.role === 'employee');
    setEmployees(data);
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const handleAssign = async (projectId, role, employeeName) => {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, { [role]: employeeName });
    setToast({ open: true, message: `${role} updated.` });
    fetchProjects();
  };

  const handleDelete = async () => {
    if (deletingProject) {
      await deleteDoc(doc(db, 'projects', deletingProject.id));
      setToast({ open: true, message: 'Project deleted.' });
      fetchProjects();
    }
    setConfirmDialog(false);
    setDeletingProject(null);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <div>
          <IconButton onClick={handleMenuOpen}><AccountCircle fontSize="large" /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TeamList employees={employees} onRefresh={fetchEmployees} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Projects</Typography>
            <Button variant="contained" onClick={() => {
              setSelectedProject(null);
              setOpenModal(true);
            }}>
              + Create Project
            </Button>
          </Box>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard
                  project={project}
                  onEdit={() => {
                    setSelectedProject(project);
                    setOpenModal(true);
                  }}
                  onAssign={handleAssign}
                  onDelete={() => {
                    setDeletingProject(project);
                    setConfirmDialog(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={selectedProject}
        onSubmit={async (formData) => {
          const ref = selectedProject
            ? doc(db, 'projects', selectedProject.id)
            : doc(collection(db, 'projects'));
          await setDoc(ref, formData, { merge: true });
          setToast({
            open: true,
            message: selectedProject ? 'Project updated.' : 'Project created.'
          });
          setOpenModal(false);
          fetchProjects();
        }}
      />

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
      />
    </Container>
  );
}

export default AdminPanel;
