import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import WeightProgressChart from "../components/CalorieTracker/WeightProgressChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useWeightUnit } from "../context/WeightUnitContext";

const CalorieTrackerPage = () => {
  const genderRef = useRef("male");
  const ageRef = useRef("");
  const heightRef = useRef("");
  const currentWeightRef = useRef("");
  const targetWeightRef = useRef("");
  const activityLevelRef = useRef(1.2);

  const [targetDate, setTargetDate] = useState(null); // Use state only for the date
  const [goal, setGoal] = useState("weight_loss"); // Changed to state
  const [dailyCalories, setDailyCalories] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [showCops, setShowCops] = useState(false);

  const { weightUnit } = useWeightUnit();

  // Prevent invalid input (negative, letters, etc.)
  const preventNegativeInput = useCallback((e) => {
    if (
      e.key === "-" ||
      e.key === "+" ||
      e.key === "e" ||
      (isNaN(Number(e.key)) && e.key !== "Backspace")
    ) {
      e.preventDefault();
    }
  }, []);

  const calculateDailyCalories = (event) => {
    event.preventDefault();

    // Safely access refs with null checks
    const gender = genderRef.current?.value || "male";
    const age = parseInt(ageRef.current?.value || "0", 10);
    const height = parseInt(heightRef.current?.value || "0", 10);
    const currentWeight = parseFloat(currentWeightRef.current?.value || "0");
    const activityLevel = parseFloat(activityLevelRef.current?.value || "1.2");

    // Ensure targetWeight is only accessed if needed
    const targetWeight =
      goal !== "maintenance"
        ? parseFloat(targetWeightRef.current?.value || "0")
        : null;

    setErrorMessage("");

    if (!currentWeight || !targetDate || !age || !height || !goal) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (goal !== "maintenance" && !targetWeight) {
      setErrorMessage("Please fill out the target weight.");
      return;
    }

    const targetD = new Date(targetDate);
    const today = new Date();
    const timeDiff = targetD.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 0) {
      setErrorMessage("Please select a future date.");
      return;
    }

    // Convert weight if necessary
    const currentWeightKg =
      weightUnit === "lbs" ? currentWeight / 2.20462 : currentWeight;
    const targetWeightKg =
      goal !== "maintenance"
        ? weightUnit === "lbs"
          ? targetWeight / 2.20462
          : targetWeight
        : currentWeightKg;

    const weightDifference = goal === "maintenance" ? 0 : targetWeightKg - currentWeightKg;

    if (goal === "weight_loss" && weightDifference >= 0) {
      setErrorMessage("Target weight must be less than current weight for weight loss.");
      return;
    }

    if (goal === "weight_gain" && weightDifference <= 0) {
      setErrorMessage("Target weight must be greater than current weight for weight gain.");
      return;
    }

    const BMR =
      gender === "male"
        ? 10 * currentWeightKg + 6.25 * height - 5 * age + 5
        : 10 * currentWeightKg + 6.25 * height - 5 * age - 161;

    const adjustedBMR = BMR * activityLevel;

    let dailyCalories = adjustedBMR;
    if (goal === "weight_loss" || goal === "weight_gain") {
      const totalCalories = weightDifference * 7700;
      const dailyChange = totalCalories / daysDiff;

      dailyCalories =
        goal === "weight_loss" ? adjustedBMR - dailyChange : adjustedBMR + dailyChange;
    }

    setDailyCalories(Math.round(dailyCalories));

    const newLabels = Array.from({ length: daysDiff + 1 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toLocaleDateString("default", { day: "numeric", month: "short" });
    });

    const weightData = Array.from({ length: daysDiff + 1 }, (_, i) => {
      return currentWeightKg + (weightDifference * i) / daysDiff;
    });

    setLabels(newLabels);
    setData(weightData);

    setShowCops(false);
    setTimeout(() => setShowCops(true), 0);
  };

  useEffect(() => {
    if (goal === "maintenance") {
      setErrorMessage(""); // Clear errors if goal changes to maintenance
    }
  }, [goal]);

  return (
    <Container>
      <Card>
        <ContentContainer>
          <Form onSubmit={calculateDailyCalories}>
            <Title>Calorie Tracker</Title>

            <Label>Gender:</Label>
            <StyledSelect ref={genderRef} data-testid="select-gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </StyledSelect>

            <Label>Age (Years):</Label>
            <Input
              type="number"
              ref={ageRef}
              data-testid="input-age"
              placeholder="Enter age"
              onKeyDown={preventNegativeInput}
            />

            <Label>Height (cm):</Label>
            <Input
              type="number"
              ref={heightRef}
              data-testid="input-height"
              placeholder="Enter height in cm"
              onKeyDown={preventNegativeInput}
            />

            <Label>Current weight ({weightUnit}):</Label>
            <Input
              type="number"
              ref={currentWeightRef}
              data-testid="input-current-weight"
              placeholder={`Enter current weight in ${weightUnit}`}
              onKeyDown={preventNegativeInput}
            />

            {goal !== "maintenance" && (
              <>
                <Label>Target weight ({weightUnit}):</Label>
                <Input
                  type="number"
                  ref={targetWeightRef}
                  data-testid="input-target-weight"
                  placeholder={`Enter target weight in ${weightUnit}`}
                  onKeyDown={preventNegativeInput}
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
            <StyledSelect
              value={goal}
              data-testid="input-goal"
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="weight_gain">Weight Gain</option>
            </StyledSelect>

            <Label>Activity Level:</Label>
            <StyledSelect ref={activityLevelRef} data-testid="input-activity-level">
              <option value="1.2">Sedentary (little or no exercise)</option>
              <option value="1.375">Lightly active</option>
              <option value="1.55">Moderately active</option>
              <option value="1.725">Very active</option>
              <option value="1.9">Super active</option>
            </StyledSelect>

            {errorMessage && <Error>{errorMessage}</Error>}

            <Button type="submit">Calculate</Button>
            {dailyCalories && (
              <Result>Your daily calorie intake should be: {dailyCalories} kcal/day</Result>
            )}
          </Form>

          <WeightProgressChart
            labels={labels}
            data={data}
            theme={{ primary: "#4e73df", bgLight: "#f8f9fc", text_primary: "#858796" }}
            goal={goal}
            currentWeight={currentWeightRef.current?.value || 0}
            showCops={showCops}
          />
        </ContentContainer>
      </Card>
    </Container>
  );
};

export default CalorieTrackerPage;


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
  padding: 90px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 0 15px rgba(58, 59, 69, 0.15);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 50px; /* Add space between the form and graph */
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

