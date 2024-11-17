import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { getWorkouts } from "../api";
import { CircularProgress } from "@mui/material";
import { deleteWorkout } from "../api";
import { useWeightUnit } from "../context/WeightUnitContext";
import { useTheme } from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  background-color: ${({ theme }) => theme.chart_back};
`;



const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Workouts = () => {
  const { weightUnit, convertWeight } = useWeightUnit();
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const theme = useTheme();

  const getTodaysWorkout = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await getWorkouts(token, date ? `?date=${date}` : "").then((res) => {
      const convertedWorkouts = res?.data?.todaysWorkouts.map((workout) => ({
        ...workout,
        weight: convertWeight(workout.weight),
      }));
      setTodaysWorkouts(convertedWorkouts);
      setLoading(false);
    });
  };

  const handleDelete = async (workoutId) => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await deleteWorkout(token, workoutId);
      setTodaysWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout._id !== workoutId)
      );
    } catch (err) {
      console.error("Error deleting workout:", err);
      alert("Failed to delete workout");
    }
  };

  useEffect(() => {
    getTodaysWorkout();
  }, [date]);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DateCalendar
    onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)}
    sx={{
        "& .MuiPickersDay-root": {
          borderRadius: "50%", // Ensure consistent styling
        },
        "& .Mui-selected": {
          backgroundColor: `${theme.primary} !important`, // Use theme's primary color
          color: "white !important", // Use white text for contrast
        },
        "& .Mui-selected:hover": {
          backgroundColor: `${theme.primaryLight} !important`, // Use theme's lighter primary color on hover
        },
      }}
  />
</LocalizationProvider>


        </Left>
        <Right>
          <Section>
            <SecTitle>Workouts on {date || "Selected Date"}</SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.length > 0 ? (
                  todaysWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout._id}
                      workout={workout}
                      weightUnit={weightUnit} 
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <p>No workouts logged for this date.</p>
                )}
              </CardWrapper>
            )}
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;
