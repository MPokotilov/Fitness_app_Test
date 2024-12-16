jest.setTimeout(10000); 
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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
        this.getDatasetMeta = jest.fn().mockReturnValue({
          data: Array(10).fill({ getProps: () => ({ x: 100, y: 200 }) }), 
        });
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

test('selected target date is too short', () => {
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

  expect(screen.getByText(/The selected target date is too short for your goal and may harm your health. Please choose a more realistic date./i)).toBeInTheDocument();
});


test('calculates daily calorie needs for weight loss', async () => {
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

  fireEvent.change(screen.getByTestId('select-gender'), { target: { value: 'male' } });
  fireEvent.change(screen.getByTestId('input-age'), { target: { value: '20' } });
  fireEvent.change(screen.getByTestId('input-height'), { target: { value: '200' } });
  fireEvent.change(screen.getByTestId('input-current-weight'), { target: { value: '100' } });
  fireEvent.change(screen.getByTestId('input-target-weight'), { target: { value: '99' } });
  fireEvent.change(screen.getByPlaceholderText(/Select a target date/i), {
    target: { value: '2025-02-28' },
  });
  fireEvent.change(screen.getByTestId('input-goal'), { target: { value: 'weight_loss' } });
  fireEvent.change(screen.getByTestId('input-activity-level'), { target: { value: '1.2' } });


  fireEvent.click(screen.getByText(/Calculate/i));
  screen.debug(); 



  await waitFor(() => {
    expect(screen.getByText(/Your daily calorie intake should be:/i)).toBeInTheDocument();
    expect(screen.getByText(/2481/i)).toBeInTheDocument();
    expect(screen.getByText(/kcal\/day/i)).toBeInTheDocument();
  });
  
  
});




test('calculates daily calorie needs for weight gain', async () => {
  render(
    <WeightUnitProvider>
      <CalorieTrackerPage />
    </WeightUnitProvider>
  );

  fireEvent.change(screen.getByTestId('select-gender'), { target: { value: 'male' } });
  fireEvent.change(screen.getByTestId('input-age'), { target: { value: '20' } });
  fireEvent.change(screen.getByTestId('input-height'), { target: { value: '200' } });
  fireEvent.change(screen.getByTestId('input-current-weight'), { target: { value: '99' } });
  fireEvent.change(screen.getByTestId('input-target-weight'), { target: { value: '100' } });
  fireEvent.change(screen.getByPlaceholderText(/Select a target date/i), {
    target: { value: '2025-02-28' },
  });
  fireEvent.change(screen.getByTestId('input-goal'), { target: { value: 'weight_gain' } });
  fireEvent.change(screen.getByTestId('input-activity-level'), { target: { value: '1.2' } });


  fireEvent.click(screen.getByText(/Calculate/i));
  screen.debug(); // Check the rendered output



  await waitFor(() => {
    expect(screen.getByText(/Your daily calorie intake should be:/i)).toBeInTheDocument();
    expect(screen.getByText(/2679/i)).toBeInTheDocument();
    expect(screen.getByText(/kcal\/day/i)).toBeInTheDocument();
  });
  
  
});




