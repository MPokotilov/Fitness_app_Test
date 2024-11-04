import React, { useState } from "react";
import styled from "styled-components";
import { updateUserEmail, updateUserPassword, updateUserName } from "../api"; // Import API functions

const EditModal = ({ open, onClose, type, currentUser, onUpdateUserInfo }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    const token = currentUser?.token;
    if (!token) {
      setErrorMessage("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      if (type === "email") {
        if (email !== confirmEmail) {
          setErrorMessage("Emails do not match.");
          return;
        }
        await updateUserEmail(currentUser._id, email, token);
        onUpdateUserInfo({ email });
      } else if (type === "name") {
        if (name !== confirmName) {
          setErrorMessage("Names do not match.");
          return;
        }
        await updateUserName(currentUser._id, name, token);
        onUpdateUserInfo({ name });
      } else if (type === "password") {
        if (newPassword !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }
        if (!currentPassword || !newPassword) {
          setErrorMessage("Please fill in all password fields.");
          return;
        }
        await updateUserPassword(currentUser._id, { currentPassword, password: newPassword }, token);
      }
      onClose();
    } catch (error) {
      setErrorMessage("Failed to update. Please try again.");
      console.error("Update failed:", error);
    }
  };

  return (
    <ModalBackdrop open={open}>
      <ModalContainer>
        <ModalHeader>Edit {type === "email" ? "Email" : type === "name" ? "Name" : "Password"}</ModalHeader>
        <ModalBody>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          {type === "email" ? (
            <>
              <Input
                type="email"
                placeholder="Enter new email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Confirm new email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </>
          ) : type === "name" ? (
            <>
              <Input
                type="text"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Confirm new name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
              />
            </>
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
const ErrorText = styled.p`
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
`;

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
