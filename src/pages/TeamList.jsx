// File: src/components/TeamList.jsx
import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Avatar, TextField, Button,
  CircularProgress, Dialog, DialogTitle, DialogActions, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  collection, doc, deleteDoc, updateDoc, addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

function TeamList({ employees, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditName(emp.name);
  };

  const updateName = async () => {
    setLoadingEditId(editingId);
    await updateDoc(doc(db, 'users', editingId), { name: editName });
    setEditingId(null);
    setEditName('');
    setLoadingEditId(null);
    setToast({ open: true, message: 'Name updated' });
    onRefresh();
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'users', deleteConfirmId));
    setDeleteConfirmId(null);
    setToast({ open: true, message: 'Employee deleted' });
    onRefresh();
  };

  const addEmployee = async () => {
    if (!newName.trim()) return;
    await addDoc(collection(db, 'users'), {
      name: newName.trim(),
      role: 'employee'
    });
    setToast({ open: true, message: 'Employee added' });
    setNewName('');
    onRefresh();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Team Members</Typography>
      {employees.map((emp, index) => (
        <Box key={emp.id} display="flex" alignItems="center" justifyContent="space-between" sx={memberBoxStyle}>
          <Box
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text', emp.name)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'grab' }}
          >
            <Avatar>{emp.name.charAt(0)}</Avatar>
            {editingId === emp.id ? (
              <TextField
                size="small"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            ) : (
              <Typography>{`${index + 1}. ${emp.name}`}</Typography>
            )}
          </Box>
          <Box>
            {editingId === emp.id ? (
              <Button
                variant="outlined"
                size="small"
                onClick={updateName}
                disabled={!editName}
              >
                {loadingEditId === emp.id ? <CircularProgress size={16} /> : 'Update'}
              </Button>
            ) : (
              <>
                <IconButton onClick={() => handleEdit(emp)}><EditIcon fontSize="small" /></IconButton>
                <IconButton onClick={() => setDeleteConfirmId(emp.id)}><DeleteIcon fontSize="small" /></IconButton>
              </>
            )}
          </Box>
        </Box>
      ))}

      <Box display="flex" gap={1} mt={2}>
        <TextField
          label="Add New Employee"
          value={newName}
          size="small"
          onChange={(e) => setNewName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={addEmployee}>ADD</Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Are you sure you want to delete this employee?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
      />
    </Box>
  );
}

const memberBoxStyle = {
  p: 1,
  my: 1,
  borderRadius: 1,
  background: '#f3f3f3',
  display: 'flex'
};

export default TeamList;
