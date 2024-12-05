import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Authentication from "../pages/Authentication";

describe("Authentication Component", () => {
  test("renders SignIn by default", () => {
    render(<Authentication />);
    expect(screen.getByText("Welcome to MastaFit")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test("switches to SignUp when clicked", () => {
    render(<Authentication />);
    fireEvent.click(screen.getByText("SignUp"));
    expect(screen.getByText("Create New Account 👋")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });
});
