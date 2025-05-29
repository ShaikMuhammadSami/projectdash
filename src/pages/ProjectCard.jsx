// import React, { useState } from 'react';
// import {
//   Card, CardContent, CardActions, IconButton, Typography,
//   Box, CircularProgress
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// function ProjectCard({ project, onEdit, onAssign, onRemoveSecondary, onDelete }) {
//   const [loadingField, setLoadingField] = useState(null);
//   const [dragOverField, setDragOverField] = useState(null); // Track which drop zone is hovered

//   const allowDrop = (e, role) => {
//     e.preventDefault();
//     const employeeName = e.dataTransfer.getData('text');

//     // Prevent dropping if secondary and employee is primary or teamLead
//     if (role === 'secondary' && (employeeName === project.primary || employeeName === project.teamLead)) {
//       return; // Don't allow drop, don't highlight
//     }
//     setDragOverField(role);
//   };

//   const handleDrop = async (e, role) => {
//     e.preventDefault();
//     setDragOverField(null);
//     const employeeName = e.dataTransfer.getData('text');
//     if (!employeeName) return;

//     if (role === 'secondary' && (employeeName === project.primary || employeeName === project.teamLead)) {
//       alert(`${employeeName} cannot be assigned to Secondary as they are already Primary or Team Lead.`);
//       return;
//     }

//     setLoadingField(role);

//     if (role === 'secondary') {
//       const current = project.secondary || [];
//       if (current.includes(employeeName) || current.length >= 3) {
//         setLoadingField(null);
//         return;
//       }
//       await onAssign(project.id, role, employeeName);
//     } else {
//       await onAssign(project.id, role, employeeName);
//     }

//     setLoadingField(null);
//   };

//   const handleRemoveSecondary = async (name) => {
//     await onRemoveSecondary(project.id, name);
//   };

//   // Shared style function to apply blue highlight when dragging over
//   const getDropZoneStyle = (role) => ({
//     ...dropZoneStyle,
//     borderColor: dragOverField === role ? '#1976d2' : '#ccc',
//     backgroundColor: dragOverField === role ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
//     cursor: 'pointer'
//   });

//   const renderDropZone = (label, fieldName) => (
//     <Box
//       onDrop={(e) => handleDrop(e, fieldName)}
//       onDragOver={(e) => allowDrop(e, fieldName)}
//       onDragLeave={() => setDragOverField(null)}
//       sx={getDropZoneStyle(fieldName)}
//     >
//       {loadingField === fieldName
//         ? <CircularProgress size={20} />
//         : `${label}: ${project[fieldName] || 'Drop here'}`}
//     </Box>
//   );

//   const renderSecondaryDropZone = () => {
//     const secondary = project.secondary || [];
//     return (
//       <Box
//         onDrop={(e) => handleDrop(e, 'secondary')}
//         onDragOver={(e) => allowDrop(e, 'secondary')}
//         onDragLeave={() => setDragOverField(null)}
//         sx={{
//           ...getDropZoneStyle('secondary'),
//           minHeight: secondary.length ? 70 : 40,
//           padding: secondary.length ? '8px' : '12px',
//         }}
//       >
//         <Typography variant="body2" sx={{ mb: 1, fontWeight: '600' }}>
//           Secondary Assignee:
//         </Typography>

//         {secondary.length > 0 ? (
//           secondary.map((name, idx) => (
//             <Box key={idx} sx={chipStyle}>
//               {name}
//               <IconButton
//                 size="small"
//                 onClick={() => handleRemoveSecondary(name)}
//                 sx={{ ml: 1 }}
//                 aria-label={`Remove ${name}`}
//               >
//                 ❌
//               </IconButton>
//             </Box>
//           ))
//         ) : !dragOverField && (
//           <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//             Drag employee here
//           </Typography>
//         )}

//         {loadingField === 'secondary' && <CircularProgress size={20} />}
//         {secondary.length >= 3 && (
//           <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
//             Max 3 members allowed
//           </Typography>
//         )}
//       </Box>
//     );
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '';
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateStr).toLocaleDateString(undefined, options);
//   };

//   return (
//     <Card>
//       {project.logoUrl && (
//         <img src={project.logoUrl} alt={project.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
//       )}
//       <CardContent>
//         <Typography variant="h6">{project.name}</Typography>
//         {project.consultant && (
//           <Typography variant="body2" sx={{ fontWeight: '600', mb: 0.5 }}>
//             Consultant: {project.consultant}
//           </Typography>
//         )}
//         {project.startDate && project.endDate && (
//           <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
//             {formatDate(project.startDate)} - {formatDate(project.endDate)}
//           </Typography>
//         )}
//         {renderDropZone('Primary Assignee', 'primary')}
//         {renderSecondaryDropZone()}
//         {renderDropZone('Team Lead', 'teamLead')}
//       </CardContent>
//       <CardActions>
//         <IconButton onClick={onEdit} color="primary" aria-label="Edit Project"><EditIcon /></IconButton>
//         <IconButton onClick={onDelete} color="error" aria-label="Delete Project"><DeleteIcon /></IconButton>
//       </CardActions>
//     </Card>
//   );
// }

// const dropZoneStyle = {
//   border: '2px dashed #ccc',
//   borderRadius: '8px',
//   padding: '8px',
//   marginTop: '8px',
//   textAlign: 'center',
//   fontSize: '0.9rem',
//   color: '#666',
//   cursor: 'pointer',
//   minHeight: 40,
// };

// const chipStyle = {
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   background: '#f1f1f1',
//   borderRadius: '4px',
//   padding: '4px 8px',
//   marginRight: 6,
//   marginBottom: 4,
//   fontSize: '0.9rem',
// };

// export default ProjectCard;
// File: src/pages/ProjectCard.jsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, IconButton, Typography,
  Box, CircularProgress, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ProjectCard({ project, onEdit, onAssign, onRemoveSecondary, onDelete }) {
  const [loadingField, setLoadingField] = useState(null);
  const [dragOverField, setDragOverField] = useState(null);

  const allowDrop = (e, role) => {
    e.preventDefault();
    const employeeName = e.dataTransfer.getData('text');
    if (role === 'secondary' && (employeeName === project.primary || employeeName === project.teamLead)) return;
    setDragOverField(role);
  };

  const handleDrop = async (e, role) => {
    e.preventDefault();
    setDragOverField(null);
    const employeeName = e.dataTransfer.getData('text');
    if (!employeeName) return;

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

  const getDropZoneStyle = (role) => ({
    ...dropZoneStyle,
    borderColor: dragOverField === role ? '#1976d2' : '#e0e0e0',
    backgroundColor: dragOverField === role ? 'rgba(25, 118, 210, 0.08)' : '#fafafa',
  });

  const renderDropZone = (label, fieldName) => (
    <Box
      onDrop={(e) => handleDrop(e, fieldName)}
      onDragOver={(e) => allowDrop(e, fieldName)}
      onDragLeave={() => setDragOverField(null)}
      sx={getDropZoneStyle(fieldName)}
    >
      {loadingField === fieldName
        ? <CircularProgress size={18} />
        : (
          <Typography variant="body2" color="text.primary">
            <strong>{label}:</strong> {project[fieldName] || 'Drop here'}
          </Typography>
        )}
    </Box>
  );

  const renderSecondaryDropZone = () => {
    const secondary = project.secondary || [];
    return (
      <Box
        onDrop={(e) => handleDrop(e, 'secondary')}
        onDragOver={(e) => allowDrop(e, 'secondary')}
        onDragLeave={() => setDragOverField(null)}
        sx={{
          ...getDropZoneStyle('secondary'),
          minHeight: secondary.length ? 70 : 48,
          padding: secondary.length ? '8px' : '12px',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Secondary Assignees:
        </Typography>

        {secondary.length > 0 ? (
          secondary.map((name, idx) => (
            <Box key={idx} sx={chipStyle}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', mr: 1 }}>{name[0]}</Avatar>
              <Typography variant="body2">{name}</Typography>
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
        ) : !dragOverField && (
          <Typography variant="caption" color="text.secondary">
            Drag employee here (max 3)
          </Typography>
        )}

        {loadingField === 'secondary' && <CircularProgress size={20} />}
        {secondary.length >= 3 && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            Max 3 members allowed
          </Typography>
        )}
      </Box>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
      {project.logoUrl && (
        <Box sx={{ height: 130, backgroundImage: `url(${project.logoUrl})`, backgroundSize: 'cover' }} />
      )}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>{project.name}</Typography>
        {project.consultant && (
          <Typography variant="body2" color="textSecondary">
            Consultant: <strong>{project.consultant}</strong>
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </Typography>

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
  padding: '10px',
  marginTop: '10px',
  textAlign: 'left',
  fontSize: '0.9rem',
  color: '#555',
  minHeight: 40,
};

const chipStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#e3f2fd',
  borderRadius: '16px',
  padding: '4px 8px',
  marginBottom: '4px',
  marginRight: '6px',
};

export default ProjectCard;
