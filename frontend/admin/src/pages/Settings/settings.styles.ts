import { styled } from '@mui/material/styles';
import { Box, Card, Button, Typography } from '@mui/material';

export const Container = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
}));

export const StyledCard = styled(Card)(() => ({
  maxWidth: '600px',
  width: '100%',
}));

export const Title = styled(Typography)(() => ({
  marginBottom: '1rem',
}));

export const InfoText = styled(Typography)(() => ({
  marginTop: '1rem',
  marginBottom: '0.5rem',
}));

export const ResetButton = styled(Button)<{ component?: React.ElementType }>(({ theme }) => ({
  marginTop: '1.5rem',
  width: '100%',
}));
