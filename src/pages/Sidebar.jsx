// File: src/components/Sidebar.jsx

import React from 'react';
import {
  Box, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, Avatar
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Sidebar({ selected, setSelected }) {
  const menuItems = [
    { label: 'All Projects', icon: <FolderIcon />, key: 'projects' },
    { label: 'Teams', icon: <GroupIcon />, key: 'teams' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 1,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ p: 2, fontWeight: 'bold', color: '#4527A0', textAlign: 'center' }}
        >
          BOLT-HR
        </Typography>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.key}
            //   selected={selected === item.key}
            //   onClick={() => setSelected(item.key)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#e8eaf6',
                  '&:hover': {
                    backgroundColor: '#d1c4e9'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              <ChevronRightIcon sx={{ color: '#aaa' }} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 36, height: 36, mr: 1 }}>M</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>Muheed</Typography>
          <Typography variant="caption" color="textSecondary">
            muheed@admin.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
