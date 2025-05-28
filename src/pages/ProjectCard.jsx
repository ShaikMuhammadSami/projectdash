
import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, IconButton, Typography,
  Box, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ProjectCard({ project, onEdit, onAssign, onRemoveSecondary, onDelete }) {
  const [loadingField, setLoadingField] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Check if dragging employee can be dropped on secondary
  const allowDrop = (e) => {
    e.preventDefault();
    const employeeName = e.dataTransfer.getData('text');
    // Disable drop if employee is primary or teamLead
    if (employeeName === project.primary || employeeName === project.teamLead) {
      return; // Don't allow drop
    }
    setIsDragOver(true);
  };

  const handleDrop = async (e, role) => {
    e.preventDefault();
    setIsDragOver(false);
    const employeeName = e.dataTransfer.getData('text');
    if (!employeeName) return;

    // Prevent adding primary or teamLead to secondary
    if (role === 'secondary' && (employeeName === project.primary || employeeName === project.teamLead)) {
      alert(`${employeeName} cannot be assigned to Secondary as they are already Primary or Team Lead.`);
      return;
    }

    setLoadingField(role);

    if (role === 'secondary') {
      const current = project.secondary || [];
      if (current.includes(employeeName) || current.length >= 3) {
        setLoadingField(null);
        return;
      }
      await onAssign(project.id, role, employeeName);
    } else {
      await onAssign(project.id, role, employeeName);
    }

    setLoadingField(null);
  };

  const handleRemoveSecondary = async (name) => {
    await onRemoveSecondary(project.id, name);
  };

  const renderDropZone = (label, fieldName) => (
    <Box
      onDrop={(e) => handleDrop(e, fieldName)}
      onDragOver={allowDrop}
      onDragLeave={() => setIsDragOver(false)}
      sx={dropZoneStyle}
    >
      {loadingField === fieldName
        ? <CircularProgress size={20} />
        : `${label}: ${project[fieldName] || 'Drop here'}`}
    </Box>
  );

  const renderSecondaryDropZone = () => {
    const secondary = project.secondary || [];
    return (
      <Box
        onDrop={(e) => handleDrop(e, 'secondary')}
        onDragOver={allowDrop}
        onDragLeave={() => setIsDragOver(false)}
        sx={{
          ...dropZoneStyle,
          minHeight: secondary.length ? 70 : 40,
          padding: secondary.length ? '8px' : '12px',
          borderColor: isDragOver ? '#1976d2' : '#ccc',
          backgroundColor: isDragOver ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
          // If dropping disabled, show disabled cursor and faded style
          cursor: 'pointer',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600' }}>
          Secondary Assignee:
        </Typography>

        {secondary.length > 0 ? (
          secondary.map((name, idx) => (
            <Box key={idx} sx={chipStyle}>
              {name}
              <IconButton
                size="small"
                onClick={() => handleRemoveSecondary(name)}
                sx={{ ml: 1 }}
                aria-label={`Remove ${name}`}
              >
                ❌
              </IconButton>
            </Box>
          ))
        ) : !isDragOver && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Drag employee here
          </Typography>
        )}

        {loadingField === 'secondary' && <CircularProgress size={20} />}
        {secondary.length >= 3 && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Max 3 members allowed
          </Typography>
        )}
      </Box>
  );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      {project.logoUrl && (
        <img src={project.logoUrl} alt={project.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
      )}
      <CardContent>
        <Typography variant="h6">{project.name}</Typography>
        {project.consultant && (
          <Typography variant="body2" sx={{ fontWeight: '600', mb: 0.5 }}>
            Consultant: {project.consultant}
          </Typography>
        )}
        {project.startDate && project.endDate && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </Typography>
        )}
        {renderDropZone('Primary Assignee', 'primary')}
        {renderSecondaryDropZone()}
        {renderDropZone('Team Lead', 'teamLead')}
      </CardContent>
      <CardActions>
        <IconButton onClick={onEdit} color="primary" aria-label="Edit Project"><EditIcon /></IconButton>
        <IconButton onClick={onDelete} color="error" aria-label="Delete Project"><DeleteIcon /></IconButton>
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
  color: '#666',
  cursor: 'pointer',
  minHeight: 40,
};

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#f1f1f1',
  borderRadius: '4px',
  padding: '4px 8px',
  marginRight: 6,
  marginBottom: 4,
  fontSize: '0.9rem',
};

export default ProjectCard;
