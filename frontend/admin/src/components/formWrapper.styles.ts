import { styled } from '@mui/material/styles';
import { Box, TextField, Button, Typography } from '@mui/material';

interface FormContainerProps {
  height?: string;
}

export const FormContainer = styled(Box)<FormContainerProps>(({ theme, height }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: height || "100vh",
  minWidth: "450px",
  backgroundColor: theme.palette.background.default,
}));

export const FormBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  backgroundColor: theme.palette.background.paper,
  padding: '30px',
  borderRadius: '8px',
  boxShadow: theme.shadows[4],
  position: 'relative'
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: theme.typography.fontWeightMedium,
}));

export const FormError = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: '20px',
  textAlign: 'center',
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// StyledTextField
export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
  },
}));


export const LinkText = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: '10px',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));
