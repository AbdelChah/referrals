import { styled } from '@mui/system';

export const OTPContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '10px', // Space between the input fields
  margin: '20px 0',
}));

export const OTPInput = styled('input')(() => ({
  width: '50px',
  height: '50px',
  fontSize: '20px',
  textAlign: 'center',
  border: '2px solid #ccc',
  borderRadius: '8px',
  transition: 'all 0.3s ease-in-out',

  '&:focus': {
    outline: 'none',
    borderColor: '#007bff',
    boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
  },

  '&:invalid': {
    borderColor: '#dc3545',
  },
}));

export const SubmitButton = styled('button')(() => ({
  display: 'block',
  margin: '20px auto',
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out',

  '&:hover': {
    backgroundColor: '#0056b3',
  },

  '&:disabled': {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));

export const ErrorMessage = styled('div')(() => ({
  color: '#dc3545',
  fontSize: '14px',
  textAlign: 'center',
  marginTop: '10px',
}));
