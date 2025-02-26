import { styled } from '@mui/material/styles';
import { IconButton, Modal } from '@mui/material';

export const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'auto', /* Ensure the modal does not overflow */
}));

export const ModalContent = styled('div')(() => ({
  position: 'relative',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px', 
  maxWidth: '90vw',
  maxHeight: '90vh',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
}));

export const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: 'gray',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'black',
  },
}));
