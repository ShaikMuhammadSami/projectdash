// File: src/components/EmployeeList.jsx

import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Tabs, Tab,
  TextField, Button, Divider, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EmployeeList({ employees, projects, onAdd, onEdit, onDelete }) {
  const [tab, setTab] = useState(0);
  const [newEmployee, setNewEmployee] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const unassignedEmployees = employees.filter(emp =>
    !projects.some(proj =>
      proj.primary === emp.name ||
      proj.teamLead === emp.name ||
      (proj.secondary && proj.secondary.includes(emp.name))
    )
  );

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
    <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: 2, p: 2, boxShadow: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Employees</Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }} textColor="primary">
        <Tab label="All" sx={{ textTransform: 'none', fontWeight: 500 }} />
        <Tab label="Unassigned" sx={{ textTransform: 'none', fontWeight: 500 }} />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {displayedEmployees.map((employee) => (
        <Box
          key={employee.id}
          draggable
          onDragStart={(e) => startDrag(e, employee.name)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            p: 1,
            borderRadius: 2,
            mb: 1,
            boxShadow: 1,
            cursor: 'grab'
          }}
        >
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {employee.name.charAt(0).toUpperCase()}
          </Avatar>

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
              <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{employee.name}</Typography>
              <IconButton size="small" onClick={() => { setEditId(employee.id); setEditName(employee.name); }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(employee.id)}>
                <DeleteIcon fontSize="small" />
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

export default EmployeeList;
