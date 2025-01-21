import styled from '@emotion/styled';
import { IconButton, Modal, Fade, Backdrop } from '@mui/material';

export const StyledModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;  /* Ensure the modal does not overflow */
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 400px; /* Adjust this width if needed */
  max-width: 90vw; /* Ensure it's responsive */
  max-height: 90vh; /* Ensure it's responsive */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: -20px;
  right: 10px;
  color: gray;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: black;
  }
`;
