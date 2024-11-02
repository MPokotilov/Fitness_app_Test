import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import { useWeightUnit } from "../context/WeightUnitContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Avatar, IconButton } from "@mui/material";
import { WbSunny, Nightlight, FitnessCenter, Edit } from "@mui/icons-material";
import EditModal from "./EditModal";  // Import the modal

const SettingsDropdown = ({ currentUser, toggleTheme, isDarkMode }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { weightUnit, toggleWeightUnit } = useWeightUnit();

  const [editModalOpen, setEditModalOpen] = useState(false); // State for Edit Modal
  const [editType, setEditType] = useState(""); // To track whether editing email or password

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Open the modal for editing
  const handleEditClick = (type) => {
    setEditType(type);
    setEditModalOpen(true);
  };

  return (
    <DropdownContainer>
      <IconButton onClick={handleDropdownToggle} style={{ position: "relative" }}>
        <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
        <ArrowDropDownIcon
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            marginLeft: "5px",
            color: "#fff",
          }}
        />
      </IconButton>

      {isOpen && (
        <DropdownMenu>
          <UserInfo>
            <UserName>{currentUser?.name}</UserName>
            <UserEmail>
              {currentUser?.email}
              <EditIcon onClick={() => handleEditClick("email")} />  {/* Button for email edit */}
            </UserEmail>
          </UserInfo>
          <MenuOption onClick={() => handleEditClick("password")}>Change Password</MenuOption>
          <ToggleContainer>
            <OptionToggleLabel>
              {isDarkMode ? (
                <Nightlight style={{ marginRight: "5px", color: "#FFD700", fontSize: "20px" }} />
              ) : (
                <WbSunny style={{ marginRight: "5px", color: "#FFD700", fontSize: "20px" }} />
              )}
              Theme
            </OptionToggleLabel>
            <ThemeButton onClick={toggleTheme} isDarkMode={isDarkMode}>
              {isDarkMode ? "Dark" : "Light"}
            </ThemeButton>
          </ToggleContainer>
          <ToggleContainer>
            <OptionToggleLabel>
              <FitnessCenter style={{ marginRight: "5px" }} />
              Weight Unit ({weightUnit})
            </OptionToggleLabel>
            <WeightButton onClick={toggleWeightUnit}>
              {weightUnit === "kg" ? "Lbs" : "Kg"}
            </WeightButton>
          </ToggleContainer>
          <SignOutOption onClick={() => dispatch(logout())}>SIGN OUT</SignOutOption>
        </DropdownMenu>
      )}

      {/* Modal for editing email/password */}
      {editModalOpen && (
        <EditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          type={editType}
          currentUser={currentUser}
        />
      )}
    </DropdownContainer>
  );
};

export default SettingsDropdown;

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: -50px;
  width: 200px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const UserInfo = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary};
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary};
`;

const UserEmail = styled.div`
  font-size: 0.9em;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
`;

const EditIcon = styled(Edit)`
  margin-left: 8px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const MenuOption = styled.div`
  padding: 8px 0;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SignOutOption = styled(MenuOption)`
  font-weight: bold;
  color: ${({ theme }) => theme.secondary};
  text-align: center;
`;

// Toggle Components
const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const OptionToggleLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const ThemeButton = styled.button`
  background: ${({ isDarkMode, theme }) => (isDarkMode ? theme.primary : theme.secondary)};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
`;

const WeightButton = styled.button`
  background: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
`;
