import { styled } from '@mui/material/styles';

export const FooterWrapper = styled('footer')(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#98A9BC',
  padding: '20px',
  textAlign: 'center',
  marginTop: 'auto',
}));

export const FooterText = styled('p')(({ theme }) => ({
  fontSize: '14px',
  margin: 0,
}));
