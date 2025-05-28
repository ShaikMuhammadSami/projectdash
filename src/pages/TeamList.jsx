
import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Tabs, Tab, TextField, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TeamList({ employees, projects, onAdd, onEdit, onDelete, onRefresh }) {
  const [tab, setTab] = useState(0);
  const [newEmployee, setNewEmployee] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_, newValue) => setTab(newValue);

  // Filter employees not assigned to any project
  const unassignedEmployees = employees.filter(emp => {
    return !projects.some(proj => 
      proj.primary === emp.name || 
      (proj.secondary && proj.secondary.includes(emp.name)) || 
      proj.teamLead === emp.name
    );
  });

  const displayedEmployees = tab === 0 ? employees : unassignedEmployees;

  const startDrag = (e, name) => {
    e.dataTransfer.setData('text', name);
  };

  const handleAdd = async () => {
    if (!newEmployee.trim()) return;
    setLoading(true);
    await onAdd(newEmployee.trim());
    setNewEmployee('');
    setLoading(false);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    setLoading(true);
    await onEdit(editId, editName.trim());
    setEditId(null);
    setEditName('');
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Team Members</Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All" />
        <Tab label="Unassigned" />
      </Tabs>

      {displayedEmployees.map(employee => (
        <Box
          key={employee.id}
          draggable
          onDragStart={(e) => startDrag(e, employee.name)}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            mb: 1,
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
            cursor: 'grab'
          }}
        >
          {editId === employee.id ? (
            <>
              <TextField
                size="small"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Button variant="contained" onClick={handleEditSave} disabled={loading}>Save</Button>
              <Button onClick={() => setEditId(null)} sx={{ ml: 1 }}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography sx={{ flexGrow: 1 }}>{employee.name}</Typography>
              <IconButton size="small" onClick={() => { setEditId(employee.id); setEditName(employee.name); }}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(employee.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      ))}

      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          label="Add New Employee"
          value={newEmployee}
          onChange={(e) => setNewEmployee(e.target.value)}
          fullWidth
          size="small"
          disabled={loading}
        />
        <Button variant="contained" onClick={handleAdd} disabled={loading || !newEmployee.trim()} sx={{ ml: 1 }}>
          ADD
        </Button>
      </Box>
    </Box>
  );
}

export default TeamList;

