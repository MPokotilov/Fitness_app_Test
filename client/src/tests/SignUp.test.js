import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import SignUp from "../components/SignUp";

const mockStore = configureStore([]);

describe("SignUp Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { currentUser: null },
    });
  });

  it("renders all fields correctly", () => {
    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    // Check if title and subtitle are rendered
    expect(screen.getByText(/Create New Account 👋/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter details to create a new account/i)).toBeInTheDocument();

    // Check if all input fields are rendered
    expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();

    // Check if the SignUp button is rendered
    expect(screen.getByText(/SignUp/i)).toBeInTheDocument();
  });

  it("validates inputs before submitting", () => {
    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    // Click on the SignUp button without filling in any fields
    fireEvent.click(screen.getByText(/SignUp/i));

    // Check if an alert is shown for missing fields
    // Mock window.alert for the test
    jest.spyOn(window, "alert").mockImplementation(() => {});
    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  it("handles input changes correctly", () => {
    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    // Fill in the name field
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");

    // Fill in the email field
    const emailInput = screen.getByPlaceholderText(/Enter your email address/i);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");

    // Fill in the password field
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("calls the signup function on valid input", async () => {
    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    // Mock the API call
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // Fill in valid details
    fireEvent.change(screen.getByPlaceholderText(/Enter your full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "password123" },
    });

    // Click the SignUp button
    fireEvent.click(screen.getByText(/SignUp/i));

    // Ensure the API call was made
    expect(window.alert).toHaveBeenCalledWith("Account Created Success");
  });
});
