import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Chart from "chart.js/auto";
import cyclistGif from './bicyclist.gif';

const CalorieTrackerPage = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dailyCalories, setDailyCalories] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("weight_loss");
  const [activityLevel, setActivityLevel] = useState(1.2); 

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const updateChart = (labels, data) => {
    if (chartInstance.current) {
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update();
    }
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [], 
        datasets: [
          {
            label: "Weight Loss Progress",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (kg)',
            },
          },
        },
        plugins: {
          legend: {
            onClick: () => {}, 
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const calculateDailyCalories = (event) => {
    event.preventDefault(); 

    if (!currentWeight || !targetWeight || !targetDate || !age || !height || !gender || !goal) {
      alert("Please fill out all fields.");
      return;
    }

    const currentW = parseFloat(currentWeight);
    const targetW = parseFloat(targetWeight);
    const targetD = new Date(targetDate);
    const today = new Date();
    const timeDiff = targetD.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 0) {
      alert("Please select a future date.");
      return;
    }

    if (goal === "weight_loss" && targetW >= currentW) {
      alert("Target weight must be less than current weight for weight loss.");
      return;
    } else if (goal === "weight_gain" && targetW <= currentW) {
      alert("Target weight must be greater than current weight for weight gain.");
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
    const weightDifference = currentW - targetW;
    const monthsDiff = targetD.getMonth() - today.getMonth() + (12 * (targetD.getFullYear() - today.getFullYear()));

    if (goal === "weight_loss") {
      const maxDeficit = adjustedBMR * 0.3;
      const totalCaloriesToBurn = weightDifference * 7700;
      const dailyCalorieDeficit = totalCaloriesToBurn / daysDiff;

      if (dailyCalorieDeficit > maxDeficit) {
        alert("The selected period is too short for healthy weight loss. Please choose a longer period.");
        return;
      }

      dailyCalories = adjustedBMR - dailyCalorieDeficit;
    } else if (goal === "weight_gain") {
      const maxSurplus = adjustedBMR * 0.3;
      const totalCaloriesToGain = weightDifference * 7700;
      const dailyCalorieSurplus = totalCaloriesToGain / daysDiff;

      if (dailyCalorieSurplus > maxSurplus) {
        alert("The selected period is too short for healthy weight gain. Please choose a longer period.");
        return;
      }

      dailyCalories = adjustedBMR - dailyCalorieSurplus;
    } else {
      dailyCalories = adjustedBMR;
    }

    setDailyCalories(dailyCalories);

    const labels = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      return date.toLocaleString('default', { month: 'short' });
    });

    const weightData = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      return currentW - (i / monthsDiff) * weightDifference;
    });

    updateChart(labels, weightData);
  };

  return (
    <Container>
      <Card>
        <ContentContainer>
          <Form onSubmit={calculateDailyCalories}> {}
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
            />

            <Label>Height (cm):</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
            />

            <Label>Current weight (Kg):</Label>
            <Input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="Enter current weight"
            />

            {goal !== "maintenance" && (
              <>
                <Label>Target weight (Kg):</Label>
                <Input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="Enter target weight"
                />
              </>
            )}

            <Label>Target date:</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            <Label>Goal:</Label>
            <StyledSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintain Weight</option>
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

            <Button type="submit">Calculate</Button>

            {dailyCalories && (
              <Result>Your daily calorie intake should be: {Math.round(dailyCalories)} kcal/day</Result>
            )}
          </Form>

          <ChartContainer>
            <canvas ref={chartRef}></canvas>
            <CyclistImage src={cyclistGif} alt="Cyclist animation" />
          </ChartContainer>
        </ContentContainer>
      </Card>
    </Container>
  );
};

export default CalorieTrackerPage;


// Styles

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: scroll;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
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
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledSelect = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  
`;

const Button = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Result = styled.p`
  margin-top: 20px;
  font-size: 18px;
`;

const ChartContainer = styled.div`
  flex: 1;
  padding: 20px;
  height: 600px;
  width: 500px;
  position: relative;
  margin-top: 10%;
`;

const CyclistImage = styled.img`
  position: absolute;
  bottom: 90%;
  right: 70%;
  width: 100px;
  height: auto;
`;

const Error = styled.p`
  color: red;
  margin-top: 10px;
`;
