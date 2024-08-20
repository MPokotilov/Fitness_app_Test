import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import './App.css';

function App() {
  return (
    <ThemeProvider theme={lightTheme}> Hello World</ThemeProvider>
  );
}

export default App;
