import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../components/SignIn";

describe("SignIn Component", () => {
  test("renders the form", () => {
    render(<SignIn />);
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("SignIn")).toBeInTheDocument();
  });

  test("displays an error when fields are empty", () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("SignIn"));
    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
  });
});
