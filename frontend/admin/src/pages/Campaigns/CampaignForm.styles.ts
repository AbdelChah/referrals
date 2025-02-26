import { styled } from '@mui/material/styles';

export const FormContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  maxWidth: '600px',
  margin: '10% auto',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
}));

export const InputField = styled('input')(() => ({
  marginBottom: '15px',
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%',
  fontSize: '16px',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: '#007bff',
  },
}));

export const SelectField = styled('select')(() => ({
  marginBottom: '15px',
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  minWidth: '170px',
  width: '100%',
  fontSize: '16px',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: '#007bff',
  },
}));

export const Button = styled('button')(() => ({
  backgroundColor: '#FFD740',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

export const ErrorMessage = styled('div')(() => ({
  color: 'red',
  fontSize: '14px',
  marginBottom: '10px',
}));

export const CriteriaContainer = styled('div')(() => ({
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  border: '1px solid #ddd',
}));

export const CriteriaLabel = styled('div')(() => ({
  fontSize: '16px',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
}));

export const AddButton = styled(Button)(() => ({
  backgroundColor: '#007bff',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

export const RemoveButton = styled(Button)(() => ({
  backgroundColor: '#ff4444',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#cc0000',
  },
}));

export const Label = styled('label')(() => ({
  fontSize: '16px',
  marginBottom: '8px',
  color: '#333',
}));

export const DateFieldsRow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '15px',
}));

export const DateField = styled('div')(() => ({
  flex: 1,
}));

export const NoCriteriaMessage = styled('p')(() => ({
  color: '#007bff',
  fontSize: '16px',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '15px',
}));

export const CriteriaRow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '15px',
  alignItems: 'center',
}));

export const RewardFieldsRow = styled('div')(() => ({
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
}));
