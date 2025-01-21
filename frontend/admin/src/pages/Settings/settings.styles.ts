import styled from '@emotion/styled';
import { Box, Card, Button, Typography } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const StyledCard = styled(Card)`
  max-width: 600px;
  width: 100%;
`;

export const Title = styled(Typography)`
  margin-bottom: 1rem;
`;

export const InfoText = styled(Typography)`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;
export const ResetButton = styled(Button)<{ component?: React.ElementType }>`
  margin-top: 1.5rem;
  width: 100%;
`;
