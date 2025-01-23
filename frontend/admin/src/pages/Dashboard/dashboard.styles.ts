import { styled } from '@mui/system';

export const Container = styled('div')(() => ({
  padding: '20px',
  backgroundColor: '#f9f9f9',
}));

export const Title = styled('h1')(() => ({
  textAlign: 'center',
  marginBottom: '30px',
}));

export const Card = styled('div')(() => ({
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

export const CardTitle = styled('h3')(() => ({
  marginBottom: '15px',
  fontSize: '18px',
}));

export const CardValue = styled('p')(() => ({
  fontSize: '16px',
  margin: '5px 0',
}));

export const MetricContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '30px',
}));
