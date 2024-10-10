import React from "react";
import styled from "styled-components";
import Button from "./Button";

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
  const handleAddWorkout = () => {
    addNewWorkout();
  };

  return (
    <Card>
      <Title>Add New Workout</Title>

      <Label>Date</Label>
      <DateInput
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Select a date"
      />

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

      <Label>Weight (kg)</Label>
      <Input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight in kg"
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
