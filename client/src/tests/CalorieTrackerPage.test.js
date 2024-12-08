import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CalorieTrackerPage from '../pages/CalorieTrackerPage';
import { WeightUnitProvider } from '../context/WeightUnitContext';

test('calculates daily calorie needs for maintenance', () => {
  // Render with context provider
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

  // Interact with the form
  fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
  fireEvent.change(screen.getByPlaceholderText(/Age \(Years\)/i), { target: { value: 20 } });
  fireEvent.change(screen.getByPlaceholderText(/Height \(cm\)/i), { target: { value: 200 } });
  fireEvent.change(screen.getByPlaceholderText(/Current weight \(kg\)/i), { target: { value: 100 } });
  fireEvent.change(screen.getByPlaceholderText(/Target date/i), { target: { value: '2024-12-31' } });
  fireEvent.change(screen.getByLabelText(/Goal/i), { target: { value: 'Maintenance' } });
  fireEvent.change(screen.getByLabelText(/Activity Level/i), { target: { value: '1.375' } });

  // Click the calculate button
  fireEvent.click(screen.getByText(/Calculate/i));

  // Verify the result
  expect(screen.getByText(/2,963 kcal\/day/i)).toBeInTheDocument();
});
