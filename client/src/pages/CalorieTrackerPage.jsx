import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import FormField from '../components/CalorieTracker/FormField';
import WeightProgressChart from '../components/CalorieTracker/WeightProgressChart';
import { useWeightUnit } from '../context/WeightUnitContext';

const CalorieTrackerPage = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [showTargetWeight, setShowTargetWeight] = useState(true);
  const [targetDate, setTargetDate] = useState("");
  const [dailyCalories, setDailyCalories] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("weight_loss");
  const [activityLevel, setActivityLevel] = useState(1.2);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [showCops, setShowCops] = useState(false);
  const { weightUnit } = useWeightUnit();
  const today = new Date().toLocaleDateString('en-CA');

  const preventNegativeInput = useCallback((e) => {
    if (e.key === "-" || e.key === "+" || e.key === "e" || isNaN(Number(e.key)) && e.key !== "Backspace") {
      e.preventDefault();
    }
  }, []);

  const convertWeight = (weight, unit) => {
    if (unit === "lbs") {
      return (weight * 2.20462).toFixed(2);
    } else {
      return (weight / 2.20462).toFixed(2);
    }
  };

  const calculateDailyCalories = (event) => {
    event.preventDefault();
    setErrorMessage("");
  
    // Проверка обязательных полей
    if (!currentWeight || !targetDate || !age || !height || !gender || !goal) {
      setErrorMessage("Please fill out all fields.");
      return;
    }
  
    // Если цель не "maintenance", проверяем наличие целевого веса
    if (goal !== "maintenance" && !targetWeight) {
      setErrorMessage("Please fill out the target weight.");
      return;
    }
  
    const currentW = weightUnit === "lbs" ? parseFloat(currentWeight) / 2.20462 : parseFloat(currentWeight);
    const targetW = goal !== "maintenance" ? (weightUnit === "lbs" ? parseFloat(targetWeight) / 2.20462 : parseFloat(targetWeight)) : currentW; // Если "maintenance", цель = текущий вес
    const targetD = new Date(targetDate);
    const today = new Date();
    const timeDiff = targetD.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    if (daysDiff <= 0) {
      setErrorMessage("Please select a future date.");
      return;
    }
  
    if (goal === "weight_loss" && targetW >= currentW) {
      setErrorMessage("Target weight must be less than current weight for weight loss.");
      return;
    } else if (goal === "weight_gain" && targetW <= currentW) {
      setErrorMessage("Target weight must be greater than current weight for weight gain.");
      return;
    }
  
    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
  
    let BMR;
    if (gender === "male") {
      BMR = (10 * currentW) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      BMR = (10 * currentW) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }
  
    const adjustedBMR = BMR * activityLevel;
    let dailyCalories;
    const weightDifference = targetW - currentW;
    const monthsDiff = targetD.getMonth() - today.getMonth() + (12 * (targetD.getFullYear() - today.getFullYear()));
  
    if (goal === "weight_loss") {
      const maxDeficit = adjustedBMR * 0.3;
      const totalCaloriesToBurn = (currentW - targetW) * 7700;
      const dailyCalorieDeficit = totalCaloriesToBurn / daysDiff;
  
      if (dailyCalorieDeficit > maxDeficit) {
        setErrorMessage("The selected period is too short for healthy weight loss. Please choose a longer period.");
        return;
      }
  
      dailyCalories = adjustedBMR - dailyCalorieDeficit;
    } else if (goal === "weight_gain") {
      const maxSurplus = adjustedBMR * 0.3;
      const totalCaloriesToGain = (targetW - currentW) * 7700;
      const dailyCalorieSurplus = totalCaloriesToGain / daysDiff;
  
      if (dailyCalorieSurplus > maxSurplus) {
        setErrorMessage("The selected period is too short for healthy weight gain. Please choose a longer period.");
        return;
      }
  
      dailyCalories = adjustedBMR + dailyCalorieSurplus;
    } else {
      dailyCalories = adjustedBMR; // Для "maintenance" — просто BMR
    }
  
    setDailyCalories(dailyCalories);
  
    const newLabels = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      return date.toLocaleString('default', { month: 'short' });
    });
  
    const weightData = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      return currentW + (weightDifference * (i / monthsDiff));
    });
  
    setLabels(newLabels);
    setData(weightData);
    setShowCops(true);
  };

  useEffect(() => {
    if (goal === "maintenance") {
      setShowTargetWeight(false); // Скрыть поле
    } else {
      setShowTargetWeight(true); // Показать поле
    }
  }, [goal]);

  return (
    <Container>
      <Card>
        <ContentContainer>
          <Form onSubmit={calculateDailyCalories}>
            <Title>Calorie Tracker</Title>

            <FormField
              label="Gender:"
              type="select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />

            <FormField
              label="Age (Years):"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              onKeyDown={preventNegativeInput}
              min="1"
            />

            <FormField
              label="Height (cm):"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
              onKeyDown={preventNegativeInput}
              min="1"
            />

            <FormField
              label={`Current weight (${weightUnit}):`}
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder={`Enter current weight in ${weightUnit}`}
              onKeyDown={preventNegativeInput}
              min="1"
            />

            {showTargetWeight && (
              <FormField
                label={`Target weight (${weightUnit}):`}
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder={`Enter target weight in ${weightUnit}`}
              />
            )}

            <FormField
              label="Target date:"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />

            <FormField
              label="Goal:"
              type="select"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              options={[
                { label: "Weight Loss", value: "weight_loss" },
                { label: "Maintenance", value: "maintenance" }, // Для сохранения веса
                { label: "Weight Gain", value: "weight_gain" },
              ]}
            />

            <FormField
              label="Activity Level:"
              type="select"
              value={activityLevel}
              onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
              options={[
                { label: "Sedentary (little or no exercise)", value: "1.2" },
                { label: "Lightly active (light exercise/sports 1-3 days/week)", value: "1.375" },
                { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: "1.55" },
                { label: "Very active (hard exercise/sports 6-7 days a week)", value: "1.725" },
                { label: "Super active (very hard exercise/sports & a physical job)", value: "1.9" },
              ]}
            />

            {errorMessage && <Error>{errorMessage}</Error>}

            <Button type="submit">Calculate</Button>

            {dailyCalories && (
              <Result>Your daily calorie intake should be: {Math.round(dailyCalories)} kcal/day</Result>
            )}
          </Form>

          <WeightProgressChart
            labels={labels}
            data={data}
            theme={{ primary: "#4e73df", bgLight: "#f8f9fc", text_primary: "#858796" }}
            goal={goal}
            currentWeight={currentWeight} // Передаем currentWeight
            showCops={showCops}
          />
        </ContentContainer>
      </Card>
    </Container>
  );
};

export default CalorieTrackerPage;


// Стили
const Container = styled.div`
  padding: 20px;
  max-width: 20div;
  margin: 0 auto;
  overflow: scroll;
  background-color: ${({ theme }) => theme.bg};
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 0 15px rgba(58, 59, 69, 0.15);
  
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width:80%;
  flex-wrap: wrap;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};
`;

const Button = styled.button`
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const Result = styled.p`
  margin-top: 30px;
  font-size: 18px;
  color: ${({ theme }) => theme.green};
  font-weight: bold;
`;

const Error = styled.p`
  color: ${({ theme }) => theme.red};
  margin-top: 5px;
  margin-bottom: 10px;
  font-weight: bold;
`;
