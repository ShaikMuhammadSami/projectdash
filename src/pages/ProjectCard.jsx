// File: src/components/ProjectCard.jsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, IconButton,
  Typography, Box, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ProjectCard({ project, onEdit, onAssign, onDelete }) {
  const [loadingField, setLoadingField] = useState(null);

  const handleDrop = async (e, role) => {
    const employeeName = e.dataTransfer.getData('text');
    if (!employeeName) return;
    setLoadingField(role);
    await onAssign(project.id, role, employeeName);
    setLoadingField(null);
  };

  const allowDrop = (e) => e.preventDefault();

  const renderDropZone = (label, field) => (
    <Box
      onDrop={(e) => handleDrop(e, field)}
      onDragOver={allowDrop}
      sx={dropZoneStyle}
    >
      {loadingField === field
        ? <CircularProgress size={20} />
        : `${label}: ${project[field] || 'Drop here'}`}
    </Box>
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <Card>
      {project.logoUrl && (
        <img
          src={project.logoUrl}
          alt={project.name}
          style={{ width: '100%', height: 120, objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6">{project.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </Typography>
        {renderDropZone('Primary Assignee', 'primary')}
        {renderDropZone('Secondary Assignee', 'secondary')}
        {renderDropZone('Team Lead', 'teamLead')}
      </CardContent>
      <CardActions>
        <IconButton onClick={onEdit}><EditIcon /></IconButton>
        <IconButton onClick={onDelete}><DeleteIcon color="error" /></IconButton>
      </CardActions>
    </Card>
  );
}

const dropZoneStyle = {
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '8px',
  marginTop: '8px',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#555',
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default ProjectCard;
