import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Summarize, Settings, Help, Campaign, GroupAdd, AdminPanelSettings } from '@mui/icons-material';
import { StyledDrawer, MenuHeader, StyledListItemButton } from './sideMenu.styles'; 

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
            <StyledListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItemButton>
          </ListItem>
        ))}
        
        {/* Show "Add Admin" or "Register Admin" only for the user "infovariah" */}
        {sessionStorage.getItem("username") === "info@veriah.com" && (
          <ListItem key="add-admin" disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigation("/admin-settings")}
              selected={location.pathname === "/admin-settings"}
            >
              <ListItemIcon><AdminPanelSettings /></ListItemIcon>
              <ListItemText primary="Register Admin" />
            </StyledListItemButton>
          </ListItem>
        )}
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;
