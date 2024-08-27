import React, { useState } from "react";
import styled from "styled-components";

const CalorieTrackerPage = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dailyCalories, setDailyCalories] = useState(null);

  const calculateDailyCalories = () => {
    if (!currentWeight || !targetWeight || !targetDate) {
      alert("Please fill out all fields.");
      return;
    }

    const currentW = parseFloat(currentWeight);
    const targetW = parseFloat(targetWeight);
    const targetD = new Date(targetDate);
    const today = new Date();
    const timeDiff = targetD - today;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      alert("Please select a future date.");
      return;
    }

    const weightDifference = targetW - currentW;
    const caloriesPerKg = 7700; 
    const totalCalories = weightDifference * caloriesPerKg;
    const dailyCal = totalCalories / days;
    const baseCalories = 2000; 
    setDailyCalories(baseCalories + dailyCal);
  };

  return (
    <Container>
      <Card>
        <Title>Calorie Tracker</Title>
        <Form>
          <Label>Сurrent weight (Kg):</Label>
          <Input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="Enter current weight"
          />
          <Label>Target weight (Kg):</Label>
          <Input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="Enter target weight"
          />
          <Label>Target date:</Label>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <Button onClick={calculateDailyCalories}>Calculate</Button>
          {dailyCalories !== null && (
            <Result>
              To achieve your goal you need to consume approximately{" "}
              <strong>{dailyCalories.toFixed(0)}</strong> calories per day.
            </Result>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default CalorieTrackerPage;


const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + "20"};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + "15"};
  background: ${({ theme }) => theme.card_bg};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Input = styled.input`
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "50"};
  border-radius: 8px;
  background: ${({ theme }) => theme.input_bg};
  color: ${({ theme }) => theme.text_primary};
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary_dark};
  }

  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  margin-top: 16px;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
`;
