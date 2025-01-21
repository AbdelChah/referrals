import { styled } from '@mui/system';
import { Drawer, Typography } from '@mui/material';

// Styled Drawer
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
  },
}));

// Menu Header
export const MenuHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
  textAlign: 'center',
}));
