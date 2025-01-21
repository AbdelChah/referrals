import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Theme primary color
    color: theme.palette.primary.contrastText, // Theme contrast text
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '5px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark, // Theme dark shade for hover
    },

  }));