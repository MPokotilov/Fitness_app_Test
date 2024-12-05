import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "../components/Button";

describe("Button Component", () => {
  test("renders with text", () => {
    render(<Button text="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("disables when `isDisabled` is true", () => {
    render(<Button text="Click Me" isDisabled />);
    expect(screen.getByText("Click Me")).toBeDisabled();
  });
});
