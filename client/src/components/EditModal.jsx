import React, { useState } from "react";
import styled from "styled-components";
import { updateUserEmail, updateUserPassword } from "../api";  // API functions

const EditModal = ({ open, onClose, type, currentUser }) => {
  const [value, setValue] = useState("");

  const handleSave = async () => {
    if (type === "email") {
      await updateUserEmail(currentUser._id, value);  // API call to update email
    } else if (type === "password") {
      await updateUserPassword(currentUser._id, value);  // API call to update password
    }
    onClose();
  };

  return (
    <ModalBackdrop open={open}>
      <ModalContainer>
        <ModalHeader>Edit {type === "email" ? "Email" : "Password"}</ModalHeader>
        <ModalBody>
          <Input
            type={type === "email" ? "email" : "password"}
            placeholder={`Enter new ${type}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <ExitButton onClick={onClose}>Exit</ExitButton>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default EditModal;

// Styled Components
const ModalBackdrop = styled.div`
  display: ${({ open }) => (open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.h2`
  margin-bottom: 20px;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: center; /* Центрирование кнопок */
  gap: 10px;
`;


const SaveButton = styled.button`
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #45a049;
  }
  right:500px;
`;

const ExitButton = styled.button`
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #e53935;
  }
`;
