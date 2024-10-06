import React, { useState, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components"; // Import useTheme
import Chart from "chart.js/auto";
import cyclistGif from './bicyclist.gif';

const CalorieTrackerPage = () => {
  const theme = useTheme(); // Get the current theme at the top level of the component
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
  const cyclistRef = useRef(null);

  const [animationData, setAnimationData] = useState([]);

  const updateChart = (labels, data) => {
    if (chartInstance.current) {
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update();

      animateCyclist();
    }
  };

  const animateCyclist = () => {
    if (!chartInstance.current || !cyclistRef.current) return;

    const datasetMeta = chartInstance.current.getDatasetMeta(0);
    const points = datasetMeta.data;

    if (points.length === 0) return;

    const positions = points.map(point => ({
      x: point.getProps(['x'], true).x,
      y: point.getProps(['y'], true).y,
    }));

    setAnimationData(positions);

    let frame = 0;
    const totalFrames = 200;

    const animate = () => {
      if (frame >= totalFrames) return;

      const progress = frame / totalFrames;
      const totalPoints = positions.length - 1;
      const currentIndex = Math.floor(progress * totalPoints);
      const t = (progress * totalPoints) % 1;

      if (currentIndex >= totalPoints) return;

      const currentPoint = positions[currentIndex];
      const nextPoint = positions[currentIndex + 1];

      const x = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
      const y = currentPoint.y + (nextPoint.y - currentPoint.y) * t;

      cyclistRef.current.style.left = `${x - 25}px`;
      cyclistRef.current.style.top = `${y - 25}px`; 

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const initializeChart = () => {
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
            label: "Weight Progress",
            data: [],
            borderColor: theme.primary, // Use the primary color from the theme
            backgroundColor: theme.bgLight + "80", // Semi-transparent version of the theme's background light color
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        animation: false, 
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',
              color: theme.text_primary, // Use primary text color from the theme
            },
            ticks: {
              color: theme.text_primary, // x-axis ticks should use the primary text color
            },
            grid: {
              color: theme.text_secondary + "80", // Lighter grid lines using secondary text color from the theme
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (kg)',
              color: theme.text_primary, // y-axis title using primary text color from the theme
            },
            ticks: {
              color: theme.text_primary, // y-axis ticks using the primary text color
            },
            grid: {
              color: theme.text_secondary + "80", // Grid lines using the secondary text color
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: theme.text_primary, // Legend label color using the theme's primary text color
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    // Initialize or update chart when the component first loads
    initializeChart();
  }, []);

  useEffect(() => {
    // Only update the chart colors when the theme changes
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].borderColor = theme.primary;
      chartInstance.current.data.datasets[0].backgroundColor = theme.bgLight + "80";
      chartInstance.current.options.scales.x.title.color = theme.text_primary;
      chartInstance.current.options.scales.x.ticks.color = theme.text_primary;
      chartInstance.current.options.scales.x.grid.color = theme.text_secondary + "80";
      chartInstance.current.options.scales.y.title.color = theme.text_primary;
      chartInstance.current.options.scales.y.ticks.color = theme.text_primary;
      chartInstance.current.options.scales.y.grid.color = theme.text_secondary + "80";
      chartInstance.current.options.plugins.legend.labels.color = theme.text_primary;

      chartInstance.current.update(); // Apply the updates to the chart
    }
  }, [theme]); // Trigger when the theme changes

  const calculateDailyCalories = (event) => {
    event.preventDefault(); 
    setErrorMessage("");

    if (!currentWeight || !targetWeight || !targetDate || !age || !height || !gender || !goal) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    const currentW = parseFloat(currentWeight);
    const targetW = parseFloat(targetWeight);
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
      dailyCalories = adjustedBMR;
    }

    setDailyCalories(dailyCalories);

    const labels = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      return date.toLocaleString('default', { month: 'short' });
    });

    const weightData = Array.from({ length: monthsDiff + 1 }, (_, i) => {
      return currentW + (weightDifference * (i / monthsDiff));
    });

    updateChart(labels, weightData);
  };

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

            {errorMessage && <Error>{errorMessage}</Error>}

            <Button type="submit">Calculate</Button>

            {dailyCalories && (
              <Result>Your daily calorie intake should be: {Math.round(dailyCalories)} kcal/day</Result>
            )}
          </Form>

          <ChartContainer>
            <ChartWrapper>
              <canvas ref={chartRef}></canvas>
              <CyclistImage ref={cyclistRef} src={cyclistGif} alt="Cyclist animation" />
            </ChartWrapper>
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
  background-color: ${({ theme }) => theme.bg}; // Background color based on theme
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card}; // Card background based on theme
  box-shadow: 0 0 15px rgba(58, 59, 69, 0.15);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
  color: ${({ theme }) => theme.primary}; // Adjusted for theme
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary}; // Adjusted for theme
`;

const Input = styled.input`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #d1d3e2;
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary}; // Adjusted for theme
  background-color: ${({ theme }) => theme.bgLight}; // Adjusted for theme

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary}; // Adjusted for theme
    background-color: ${({ theme }) => theme.bgLight}; // Adjusted for theme
  }
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid ${({ theme }) => theme.text_secondary}; // Border color from theme
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary}; // Text color from theme
  background-color: ${({ theme }) => theme.card}; // Background color from theme

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary}; // Focused border color from theme
    background-color: ${({ theme }) => theme.bgLight}; // Focused background color from theme
  }

  option {
    color: ${({ theme }) => theme.text_primary}; // Option text color from theme
    background-color: ${({ theme }) => theme.bg}; // Option background color from theme
  }
`;


const Button = styled.button`
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.primary}; // Adjusted for theme
  color: ${({ theme }) => theme.white}; // Adjusted for theme
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.secondary}; // Adjusted for theme
  }
`;

const Result = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: ${({ theme }) => theme.green}; // Adjusted for theme
  font-weight: bold;
`;

const ChartContainer = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
  margin-top: 10%;
  max-width: 600px;
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
`;

const CyclistImage = styled.img`
  position: absolute;
  width: 50px;
  height: auto;
  left: 0;
  top: 0;
`;

const Error = styled.p`
  color: ${({ theme }) => theme.red}; // Adjusted for theme
  margin-top: -10px;
  margin-bottom: 10px;
  font-weight: bold;
`;
