import React from "react";
import styled from "styled-components";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import { useWeightUnit } from '../context/WeightUnitContext';

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 4px;
`;

const DateInput = styled.input`
  padding: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.input};
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.input};
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.input};
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 8px;
  
`;

const InputSets = styled.input`
  padding: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.input};
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgLight};
  
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    display: flex; /* Ensure alignment with other inputs */
    width: 100%; /* Match the width of other inputs */
  }

  .react-datepicker__input-container {
    width: 100%; /* Ensure full width for the input */
  }

  .react-datepicker__input-container input {
    width: 100%; /* Make input take full width */
    padding: 12px 15px; /* Match padding of other inputs */
    margin-bottom: 15px; /* Match spacing of other inputs */
    border: 1px solid ${({ theme }) => theme.text_secondary};
    border-radius: 5px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
    background-color: ${({ theme }) => theme.bgLight};
    box-sizing: border-box; /* Ensure consistent box model */

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      background-color: ${({ theme }) => theme.bgLight};
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
  }

  .react-datepicker__day:hover {
    background-color: ${({ theme }) => theme.primary};
  }

  .react-datepicker__day,
  .react-datepicker__day-name,
  .react-datepicker__current-month {
    color: ${({ theme }) => theme.text_secondary};
  }

  .react-datepicker__day--disabled {
    color: ${({ theme }) => theme.text_secondary};
    opacity: 0.4; /* Make disabled/past dates transparent */
    cursor: not-allowed; /* Indicate disabled state */
  }

  .react-datepicker__header {
    background-color: ${({ theme }) => theme.bgLight};
  }

  .react-datepicker {
    box-shadow: none; /* Remove default box shadow */
    background-color: ${({ theme }) => theme.bgLight};
  }
`;



const AddWorkout = ({
  date,
  setDate,
  category,
  setCategory,
  exerciseName,
  setExerciseName,
  sets,
  setSets,
  reps,
  setReps,
  weight,
  setWeight,
  time,
  setTime,
  addNewWorkout,
  buttonLoading
}) => {
  const { weightUnit } = useWeightUnit(); 

  const handleAddWorkout = () => {
    addNewWorkout();
  };

  const convertWeight = (weightValue) => {
    return weightUnit === 'kg'
      ? weightValue
      : (weightValue * 2.20462).toFixed(2);
  };

  return (
    <Card>
      <Title>Add New Workout</Title>

      <Label>Date</Label>
      <DatePickerWrapper>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          minDate={new Date()}
          placeholderText="Select a date"
          dateFormat="MM.dd.yyyy"
          locale="en-US"
        />
      </DatePickerWrapper>

      <Label>Category</Label>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Back">Back</option>
        <option value="Triceps">Triceps</option>
        <option value="Biceps">Biceps</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Legs">Legs</option>
        <option value="Chest">Chest</option>
      </Select>

      <Label>Exercise Name</Label>
      <Input
        type="text"
        value={exerciseName}
        onChange={(e) => setExerciseName(e.target.value)}
        placeholder="Enter exercise name"
      />

      <Row>
        <div>
          <Label>Sets</Label>
          <InputSets
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
          />
        </div>

        <div>
          <Label>Reps</Label>
          <InputSets
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
          />
        </div>
      </Row>

      <Label>Weight ({weightUnit === 'kg' ? 'Kg' : 'Lbs'})</Label>
      <Input
        type="number"
        value={weight}
        onChange={(e) =>
          setWeight(e.target.value)
        }
        placeholder={`Weight in ${weightUnit === 'kg' ? 'Kg' : 'Lbs'}`}
      />

      <Label>Time (min)</Label>
      <Input
        type="number"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Time in minutes"
      />

      <Button
        text="Add Workout"
        small
        onClick={handleAddWorkout}
        isLoading={buttonLoading}
        isDisabled={buttonLoading}
      />
    </Card>
  );
};

export default AddWorkout;
