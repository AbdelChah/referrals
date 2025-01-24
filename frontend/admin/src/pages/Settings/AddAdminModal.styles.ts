import { styled } from '@mui/system';
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
  borderRadius: '8px',
  width: '400px', /* Adjust this width if needed */
  maxWidth: '90vw', /* Ensure it's responsive */
  maxHeight: '90vh', /* Ensure it's responsive */
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
}));

export const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '-69px',
  right: '10px',
  color: 'gray',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'black',
  },
}));
