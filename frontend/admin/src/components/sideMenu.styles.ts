import { styled } from '@mui/system';
import { Drawer, Typography, ListItemButton } from '@mui/material';

// Styled Drawer
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
  },
}));

// Menu Header with centered logo
export const MenuHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

// Logo Image
export const LogoImage = styled('img')({
  maxWidth: '100px', // Adjust size as needed
  height: 'auto',
});

// Styled ListItemButton
export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
