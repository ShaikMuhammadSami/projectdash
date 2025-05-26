// File: src/components/ProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

function ProjectModal({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    primary: '',
    secondary: '',
    teamLead: '',
    logoUrl: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        primary: '',
        secondary: '',
        teamLead: '',
        logoUrl: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Project' : 'Create Project'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Project Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField label="Primary Support" name="primary" value={formData.primary} onChange={handleChange} fullWidth />
        <TextField label="Secondary Support" name="secondary" value={formData.secondary} onChange={handleChange} fullWidth />
        {/* <TextField label="Tertiary Support" name="tertiary" value={formData.tertiary} onChange={handleChange} fullWidth /> */}
        <TextField label="Team Lead" name="teamLead" value={formData.teamLead} onChange={handleChange} fullWidth />
        <TextField label="Logo Image URL" name="logoUrl" value={formData.logoUrl} onChange={handleChange} fullWidth />
        <TextField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
        <TextField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Update Project' : 'Create Project'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectModal;
