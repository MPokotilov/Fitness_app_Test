import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "../components/TextInput";

describe("TextInput Component", () => {
  test("renders with placeholder", () => {
    render(<TextInput placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  test("handles input change", () => {
    const mockHandleChange = jest.fn();
    render(<TextInput handelChange={mockHandleChange} />);
    fireEvent.change(screen.getByPlaceholderText(/Enter/i), { target: { value: "New Value" } });
    expect(mockHandleChange).toHaveBeenCalledWith(expect.objectContaining({ target: { value: "New Value" } }));
  });
});
