
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { MenuRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import ProfileDropdown from './SettingsDropdown'; 

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  
`;

const Logo = styled.img`
  height: 60px;
  @media (max-width: 375px) {
    justify-content: center;
  }
`;


const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 50px; // Same height as the navbar
  left: 0;
  width: 40%;
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  padding: 16px;
  z-index: 10;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text_primary};
    padding: 12px 0;
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;


const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  white-space: nowrap;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
`;

const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.input`
  cursor: pointer;
  width: 40px;
  height: 20px;
  appearance: none;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 50px;
  position: relative;
  outline: none;
  transition: background-color 0.3s;
  &:checked {
    background-color: ${({ theme }) => theme.secondary};
  }
  &:before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    background-color: ${({ theme }) => theme.white};
    border-radius: 50%;
    transition: transform 0.3s;
  }
  &:checked:before {
    transform: translateX(20px);
  }
`;

const Navbar = ({ currentUser, toggleTheme, isDarkMode }) => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuRounded sx={{ color: "inherit" }} />
        </Mobileicon>

        <NavLogo to="/">
          <Logo src={LogoImg} />
        </NavLogo>

        <NavItems>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/exercises">Exercises</Navlink>
          <Navlink to="/calorie-calculator">Calorie calculator</Navlink>

        </NavItems>
        {isMobileMenuOpen && (
          <MobileMenu isOpen={isMobileMenuOpen} ref={mobileMenuRef}>
            <Navlink to="/">Dashboard</Navlink>
            <Navlink to="/workouts">Workouts</Navlink>
            <Navlink to="/exercises">Exercises</Navlink>
            <Navlink to="/calorie-calculator">Calorie Calculator</Navlink>
          </MobileMenu>
        )}

        <UserContainer>
          {/* Use the ProfileDropdown component */}
          <ProfileDropdown
            currentUser={currentUser}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;