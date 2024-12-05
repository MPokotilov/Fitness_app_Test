import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import App from "../App";

// Mock the PersistGate to bypass rehydration during tests
jest.mock("redux-persist/integration/react", () => ({
  PersistGate: ({ children }) => children,
}));

test("renders the App component", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Replace with actual text or elements in your app
  expect(screen.getByText(/Welcome to MastaFit Fitness app/i)).toBeInTheDocument();
});

