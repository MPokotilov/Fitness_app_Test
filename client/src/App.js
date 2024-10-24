import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import Navbar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import CalorieTrackerPage from "./pages/CalorieTrackerPage";
import Exercises from "./pages/Exercises";
import ExerciseDetail from './pages/ExerciseDetail';
import { WeightUnitProvider } from "./context/WeightUnitContext"; // Import WeightUnitProvider
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <WeightUnitProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <BrowserRouter>
          {currentUser ? (
            <Container>
              <Navbar
                currentUser={currentUser}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
              <Routes>
                <Route path="/" exact element={<Dashboard />} />
                <Route path="/workouts" exact element={<Workouts />} />
                <Route path="/calorie-calculator" exact element={<CalorieTrackerPage />} />
                <Route path="/exercises" exact element={<Exercises />} />
                <Route path="/exercise/:id" element={<ExerciseDetail />} />
              </Routes>
            </Container>
          ) : (
            <Container>
              <Authentication />
            </Container>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </WeightUnitProvider>
  );
}

export default App;
