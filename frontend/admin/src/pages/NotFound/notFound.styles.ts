import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Container
export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: theme.palette.background.default, // Use theme background color
}));

// Header
export const Header = styled('h1')(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: theme.typography.fontWeightBold, // Use theme typography
  color: theme.palette.text.primary, // Theme primary text color
}));

// Message
export const Message = styled('p')(({ theme }) => ({
  fontSize: '1.25rem',
  color: theme.palette.text.secondary, // Theme secondary text color
  marginBottom: '20px',
}));

// HomeLink
export const HomeLink = styled(Link)(({ theme }) => ({
  fontSize: '1.125rem',
  color: theme.palette.primary.main, // Theme primary color
  textDecoration: 'none',
  fontWeight: theme.typography.fontWeightBold, // Use theme typography
  '&:hover': {
    textDecoration: 'underline',
  },
}));
