import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import WeightProgressChart from '../components/CalorieTracker/WeightProgressChart';
import { useWeightUnit } from '../context/WeightUnitContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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

    if (!currentWeight || !targetDate || !age || !height || !gender || !goal) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (goal !== "maintenance" && !targetWeight) {
      setErrorMessage("Please fill out the target weight.");
      return;
    }

    const currentW = weightUnit === "lbs" ? parseFloat(currentWeight) / 2.20462 : parseFloat(currentWeight);
    const targetW = goal !== "maintenance" ? (weightUnit === "lbs" ? parseFloat(targetWeight) / 2.20462 : parseFloat(targetWeight)) : currentW;
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

    if (daysDiff <= 31) {
      const newLabels = Array.from({ length: daysDiff + 1 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toLocaleDateString('default', { day: 'numeric' });
      });

      const weightData = Array.from({ length: daysDiff + 1 }, (_, i) => {
        return currentW + (weightDifference * (i / daysDiff));
      });

      setLabels(newLabels);
      setData(weightData);
    } else {
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
    }

    setShowCops(false); // Сначала убираем анимацию
    setTimeout(() => {
      setShowCops(true); // Затем снова запускаем
    }, 0);
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

            <Label>Gender:</Label>
            <StyledSelect value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </StyledSelect>

            <Label>Age (Years):</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              onKeyDown={preventNegativeInput}
              min="1"
            />

            <Label>Height (cm):</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
              onKeyDown={preventNegativeInput}
              min="1"
            />

            <Label>Current weight ({weightUnit}):</Label>
            <Input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder={`Enter current weight in ${weightUnit}`}
              onKeyDown={preventNegativeInput}
              min="1"
            />

            {showTargetWeight && (
              <>
                <Label>Target weight ({weightUnit}):</Label>
                <Input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder={`Enter target weight in ${weightUnit}`}
                />
              </>
            )}
            <Label>Target date:</Label>
            <DatePickerWrapper>
              <DatePicker
                selected={targetDate ? new Date(targetDate) : null}
                onChange={(date) => setTargetDate(date.toISOString().split("T")[0])}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a target date"
                
              />
            </DatePickerWrapper>





            <Label>Goal:</Label>
            <StyledSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="weight_gain">Weight Gain</option>
            </StyledSelect>

            <Label>Activity Level:</Label>
            <StyledSelect value={activityLevel} onChange={(e) => setActivityLevel(parseFloat(e.target.value))}>
              <option value="1.2">Sedentary (little or no exercise)</option>
              <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="1.9">Super active (very hard exercise/sports & a physical job)</option>
            </StyledSelect>

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
            currentWeight={currentWeight}
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
  max-width: 1000px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.bg};
  overflow-y: scroll;
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
  width: 100%;
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

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary};
`;

const Input = styled.input`
  padding: 12px 15px;
  width: 100%;
  border: 1px solid #d1d3e2;
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight};
  box-sizing: border-box;
  margin-bottom: 15px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bgLight};
  }
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.card};
  margin-bottom: 15px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bgLight};
  }
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

