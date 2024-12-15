import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserInfo } from "../redux/reducers/userSlice";
import { useWeightUnit } from "../context/WeightUnitContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Avatar, IconButton } from "@mui/material";
import { WbSunny, Nightlight, FitnessCenter, Edit } from "@mui/icons-material";
import EditModal from "./EditModal";

const SettingsDropdown = ({ toggleTheme, isDarkMode }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const { weightUnit, toggleWeightUnit } = useWeightUnit();
  const dropdownRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); 

  const token = localStorage.getItem("fittrack-app-token");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Open the modal for editing
  const handleEditClick = (type) => {
    setEditType(type);
    setEditModalOpen(true);
  };

  // Callback to update user info in Redux after successful change
  const onUpdateUserInfo = (updatedInfo) => {
    dispatch(updateUserInfo(updatedInfo));
  };

  return (
    <DropdownContainer ref={dropdownRef}>
       <IconButton onClick={() => setIsOpen((prev) => !prev)}>
        <Avatar src={currentUser?.img}>{currentUser?.name ? currentUser.name[0] : "U"}</Avatar>
        <ArrowDropDownIcon
  style={{
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
    marginLeft: "5px",
    color: isDarkMode ? "#A078F2" : "#2ED6CF", 
    borderRadius: "50%",
    padding: "2px",
  }}
/>

      </IconButton>

      {isOpen && (
        <DropdownMenu>
          <UserInfo>
            <UserName>
              {currentUser?.name}
              <EditIcon onClick={() => handleEditClick("name")} /> 
            </UserName>
            <UserEmail>
              {currentUser?.email}
              <EditIcon onClick={() => handleEditClick("email")} /> 
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
          <SignOutOption
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("fittrack-app-token"); // Clear token on logout
            }}
          >
            SIGN OUT
          </SignOutOption>
        </DropdownMenu>
      )}

      {/* Modal for editing email, password, or name */}
      {editModalOpen && (
        <EditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          type={editType}
          currentUser={{ ...currentUser, token }} // Pass currentUser with token
          onUpdateUserInfo={onUpdateUserInfo} // Callback to update Redux state
        />
      )}
    </DropdownContainer>
  );
};

export default SettingsDropdown;

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
  right: 20px;
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
  display: flex;
  align-items: center;
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
