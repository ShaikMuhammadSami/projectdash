import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Snackbar
} from '@mui/material';

function ProjectModal({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    primary: '',
    secondary: '', // <-- keep as string for input editing
    teamLead: '',
    consultant: '',
    logoUrl: '',
    startDate: '',
    endDate: ''
  });

  const [prevSecondary, setPrevSecondary] = useState('');
  const [toast, setToast] = useState({ open: false, message: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        secondary: (initialData.secondary || []).join(', '), // convert array to string for input
        consultant: initialData.consultant || ''
      });
      setPrevSecondary((initialData.secondary || []).join(', '));
    } else {
      setFormData({
        name: '',
        primary: '',
        secondary: '',
        teamLead: '',
        consultant: '',
        logoUrl: '',
        startDate: '',
        endDate: ''
      });
      setPrevSecondary('');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { primary, teamLead, secondary } = formData;
    // Convert secondary string to array
    const secondaryArray = secondary.split(',').map(s => s.trim()).filter(s => s.length > 0);

    // Validation: no secondary member can be primary or teamLead
    const invalidSecondary = secondaryArray.find(name => name === primary || name === teamLead);

    if (invalidSecondary) {
      setToast({
        open: true,
        message: `${invalidSecondary} cannot be in Secondary as they are already Primary or Team Lead.`
      });
      // Revert secondary to previous valid string
      setFormData(prev => ({ ...prev, secondary: prevSecondary }));
      return;
    }

    setPrevSecondary(secondary);
    onSubmit({ ...formData, secondary: secondaryArray });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{initialData ? 'Edit Project' : 'Create Project'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Project Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Consultant" name="consultant" value={formData.consultant} onChange={handleChange} fullWidth />
          <TextField
            label="Primary Support"
            name="primary"
            value={formData.primary}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Secondary Support (comma separated)"
            name="secondary"
            value={formData.secondary}
            onChange={handleChange}
            fullWidth
            helperText="Maximum 3 members"
          />
          <TextField label="Team Lead" name="teamLead" value={formData.teamLead} onChange={handleChange} fullWidth />
          <TextField label="Logo Image URL" name="logoUrl" value={formData.logoUrl} onChange={handleChange} fullWidth />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name.trim()}>
            {initialData ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, message: '' })}
        message={toast.message}
      />
    </>
  );
}

export default ProjectModal;
