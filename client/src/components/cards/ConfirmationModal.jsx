import React from 'react';
import styled from 'styled-components';
import { Modal, Box, Typography, Button } from '@mui/material';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Box)`
  background-color: ${({ theme }) => theme.bg}; // Use light background from theme
  color: ${({ theme }) => theme.text_primary};
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
`;

const ConfirmButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.red}; // Use red colour from theme
    color: ${({ theme }) => theme.white}; // Use white text for contrast
    &:hover {
      background-color: ${({ theme }) => theme.red}; // Same red colour on hover (or define a darker shade if available)
    }
  }
`;

const CancelButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.action_confirm_button}; // Use secondary colour from theme
    color: ${({ theme }) => theme.white}; // Use white text for contrast
    &:hover {
      background-color: ${({ theme }) => theme.action_confirm_button}; // Same secondary colour on hover (or define a darker shade if available)
    }
  }
`;

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <Typography variant="h6">Confirm Deletion</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Are you sure you want to delete this workout?
        </Typography>
        <ButtonGroup>
          <CancelButton variant="contained" onClick={onClose}>
            Cancel
          </CancelButton>
          <ConfirmButton variant="contained" onClick={onConfirm}>
            Delete
          </ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </StyledModal>
  );
};

export default ConfirmationModal;
