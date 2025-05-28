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

  // For employee delete confirmation dialog
  const [confirmDeleteEmployeeDialog, setConfirmDeleteEmployeeDialog] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

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
    if (role === 'secondary') {
      const project = projects.find(p => p.id === projectId);
      const current = project.secondary || [];
      if (current.includes(employeeName) || current.length >= 3) return;
      await updateDoc(projectRef, { secondary: [...current, employeeName] });
    } else {
      await updateDoc(projectRef, { [role]: employeeName });
    }
    setToast({ open: true, message: `${role} updated.` });
    fetchProjects();
  };

  const handleRemoveSecondaryMember = async (projectId, memberName) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedSecondary = project.secondary.filter(m => m !== memberName);
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, { secondary: updatedSecondary });
    setToast({ open: true, message: 'Secondary member removed.' });
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

  // Employee management functions
  const handleAddEmployee = async (name) => {
    if (!name) return;
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef), { name, role: 'employee' });
    setToast({ open: true, message: 'Employee added.' });
    fetchEmployees();
  };

  const handleEditEmployee = async (id, name) => {
    if (!id || !name) return;
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { name });
    setToast({ open: true, message: 'Employee updated.' });
    fetchEmployees();
  };

  // Open confirmation dialog before deleting employee
  const handleDeleteEmployeeConfirm = (employee) => {
    setDeletingEmployee(employee);
    setConfirmDeleteEmployeeDialog(true);
  };

  // Confirm and delete employee after dialog confirmation
  const handleConfirmDeleteEmployee = async () => {
    if (deletingEmployee) {
      const userRef = doc(db, 'users', deletingEmployee.id);
      await deleteDoc(userRef);
      setToast({ open: true, message: 'Employee deleted.' });
      fetchEmployees();
    }
    setConfirmDeleteEmployeeDialog(false);
    setDeletingEmployee(null);
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
          <TeamList
            employees={employees}
            projects={projects}
            onAdd={handleAddEmployee}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployeeConfirm} // Use confirm dialog handler
            onRefresh={fetchEmployees}
          />
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
                  onRemoveSecondary={handleRemoveSecondaryMember}
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

      {/* Project Delete Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Employee Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteEmployeeDialog} onClose={() => setConfirmDeleteEmployeeDialog(false)}>
        <DialogTitle>Are you sure you want to delete this employee?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteEmployeeDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDeleteEmployee} color="error">Delete</Button>
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


