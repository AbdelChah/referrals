import { styled } from '@mui/material/styles';

// ListContainer
export const ListContainer = styled('div')(({ theme }) => ({
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  backgroundColor: theme.palette.background.default, // Use theme color for background
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

// Table
export const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
});

// TableHeader
export const TableHeader = styled('th')(({ theme }) => ({
  backgroundColor: theme.palette.grey[200], // Use theme color
  padding: '12px',
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: 'bold',
  color: theme.palette.text.primary, // Theme-based text color
}));

// TableRow
export const TableRow = styled('tr')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider
}));

// TableCell
export const TableCell = styled('td')(({ theme }) => ({
  padding: '12px',
  textAlign: 'left',
  fontSize: '16px',
  color: theme.palette.text.secondary, // Theme-based secondary text color
}));

// Button
export const Button = styled('button')(({ theme }) => ({
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

// Button2 (inherits styles from Button)
export const Button2 = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  backgroundColor: theme.palette.secondary.main, // Theme secondary color
  textAlign: 'center',
}));
