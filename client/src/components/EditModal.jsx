import React, { useState } from "react";
import styled from "styled-components";
import { updateUserEmail, updateUserPassword } from "../api";  // API functions

const EditModal = ({ open, onClose, type, currentUser }) => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (type === "email") {
      await updateUserEmail(currentUser._id, email); // API call to update email
    } else if (type === "password") {
      
      if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
      }
      if (!currentPassword || !newPassword) {
        alert("Please fill in all password fields.");
        return;
      }

      
      await updateUserPassword(currentUser._id, { currentPassword, newPassword });
    }
    onClose();
  };

  return (
    <ModalBackdrop open={open}>
      <ModalContainer>
        <ModalHeader>Edit {type === "email" ? "Email" : "Password"}</ModalHeader>
        <ModalBody>
          {type === "email" ? (
            <Input
              type="email"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <>
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
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
  margin-bottom: 10px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
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
