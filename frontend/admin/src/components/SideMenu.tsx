import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Summarize, Settings, Help, Campaign, GroupAdd } from '@mui/icons-material';
import { StyledDrawer, MenuHeader } from './sideMenu.styles'; 

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns' },
  { text: 'Reports', icon: <Summarize />, path: '/reports' },
  {text: 'Referrals',icon:<GroupAdd/> , path: '/referrals'},
  // { text: 'Disputes', icon: <Help />, path: '/disputes' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const SideMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <MenuHeader>Admin Panel</MenuHeader>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;
