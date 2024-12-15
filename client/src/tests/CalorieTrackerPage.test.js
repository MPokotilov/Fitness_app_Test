import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CalorieTrackerPage from '../pages/CalorieTrackerPage';
import { WeightUnitProvider } from '../context/WeightUnitContext';
import '@testing-library/jest-dom';

// Mock chart.js
jest.mock('chart.js/auto', () => {
  return {
    __esModule: true,
    default: class MockChart {
      constructor() {
        this.destroy = jest.fn();
        this.update = jest.fn();
      }
    },
  };
});


test('shows error when fields are missing', () => {
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

  fireEvent.click(screen.getByText(/Calculate/i));

  expect(screen.getByText(/Please fill out all fields./i)).toBeInTheDocument();
});


test('calculates daily calorie needs for maintenance', () => {
  
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

 
  fireEvent.change(screen.getByTestId('select-gender'), { target: { value: 'male' } });
  fireEvent.change(screen.getByTestId('input-age'), { target: { value: '20' } });
  fireEvent.change(screen.getByTestId('input-height'), { target: { value: '200' } });
  fireEvent.change(screen.getByTestId('input-current-weight'), { target: { value: '100' } });
  fireEvent.change(screen.getByTestId('input-goal'), { target: { value: 'maintenance' } });
  fireEvent.change(screen.getByTestId('input-activity-level'), { target: { value: '1.375' } });
  fireEvent.change(screen.getByPlaceholderText(/Select a target date/i), {
    target: { value: '2024-12-31' },
  });

  
  fireEvent.click(screen.getByText(/Calculate/i));

  expect(screen.getByText(/2963/)).toBeInTheDocument();
});

test('calculates daily calorie needs for weight loss', () => {
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

  fireEvent.change(screen.getByTestId('select-gender'), { target: { value: 'female' } });
  fireEvent.change(screen.getByTestId('input-age'), { target: { value: '30' } });
  fireEvent.change(screen.getByTestId('input-height'), { target: { value: '165' } });
  fireEvent.change(screen.getByTestId('input-current-weight'), { target: { value: '70' } });
  fireEvent.change(screen.getByTestId('input-target-weight'), { target: { value: '60' } });
  fireEvent.change(screen.getByTestId('input-goal'), { target: { value: 'weight_loss' } });
  fireEvent.change(screen.getByTestId('input-activity-level'), { target: { value: '1.55' } });
  fireEvent.change(screen.getByPlaceholderText(/Select a target date/i), {
    target: { value: '2024-12-31' },
  });

  fireEvent.click(screen.getByText(/Calculate/i));

  expect(screen.getByText(/Your daily calorie intake should be:/i)).toBeInTheDocument();
  expect(screen.getByText(/calorie intake/i)).toBeInTheDocument();
});






