import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts, getPreviousDayDetails, deleteWorkout } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  @media (max-width: 600px) {
    padding: 10px 0; 
  }
  @media (max-width: 300px) {
    padding: 5px 0; 
  }
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 12px;
    padding: 0 10px; 
  }

  @media (max-width: 375px) {
    max-width: 350px; 
    padding: 0 8px;
  }

  @media (max-width: 300px) {
    max-width: 150px;
    gap: 8px;
    padding: 0 5px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 18px; 
    padding: 0 10px; 
    text-align: center; 
  }

  @media (max-width: 300px) {
    font-size: 16px;
    padding: 0 5px;
  }
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;

  @media (max-width: 600px) {
    gap: 12px; 
    justify-content: center; 
    padding: 0 10px; 
  }

  @media (max-width: 375px) {
    gap: 8px; 
  }

  @media (max-width: 300px) {
    gap: 5px;
    padding: 0 5px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 12px; 
    padding: 0 10px;
  }

  @media (max-width: 375px) {
    padding: 0 8px;
  }

  @media (max-width: 300px) {
    gap: 8px;
    padding: 0 5px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;

  @media (max-width: 600px) {
    gap: 12px; 
    margin-bottom: 50px; 
  }

  @media (max-width: 375px) {
    gap: 8px; 
    margin-bottom: 30px; 
  }

  @media (max-width: 300px) {
    gap: 5px; 
    margin-bottom: 15px; 
  }
`;


const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [prevData, setPrevData] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);

  // Separated state fields for each workout input
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("Back");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");

  const dashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    console.log("Token:", token);

    await getDashboardDetails(token).then((res) => {
      setData(res.data);
      console.log("Current day data:", res.data);
    });

    await getPreviousDayDetails(token).then((res) => {
      setPrevData(res.data);
      console.log("Previous day data:", res.data);
      setLoading(false);
    });
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    console.log("Token:", token);
    await getWorkouts(token, "").then((res) => {
      setTodaysWorkouts(res?.data?.todaysWorkouts);
      console.log(res.data);
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

  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("fittrack-app-token");

    if (!date) {
        alert("Please fill in all the fields.");
        setButtonLoading(false);
        return;
    }

    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const formattedDate = adjustedDate.toISOString().split('T')[0];

    // Construct workout data from individual fields
    const workoutData = {
        date: formattedDate,
        category,
        exerciseName,
        sets,
        reps,
        weight,
        time,
    };

    try {
        await addWorkout(token, workoutData);
        dashboardData();
        getTodaysWorkout();
    } catch (err) {
        if (
            err.response &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message.includes("E11000 duplicate key error")
        ) {
            // Catch MongoDB duplicate key error
            alert("Please change the name of the exercise.");
        } else {
            // Handle other errors
            alert(err.response?.data?.message || "An error occurred while adding the workout.");
        }
    } finally {
        setButtonLoading(false);
    }
};


  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {counts.map((item) => (
            <CountsCard key={item.id} item={item} data={data || {}} prevData={prevData || {}} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={data || {}} />
          <CategoryChart data={data || {}} />
          <AddWorkout
            date={date}
            setDate={setDate}
            category={category}
            setCategory={setCategory}
            exerciseName={exerciseName}
            setExerciseName={setExerciseName}
            sets={sets}
            setSets={setSets}
            reps={reps}
            setReps={setReps}
            weight={weight}
            setWeight={setWeight}
            time={time}
            setTime={setTime}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
        <Title>Today's Workouts</Title>
          <CardWrapper>
            {todaysWorkouts.length > 0 ? (
              todaysWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout._id}
                  workout={workout}
                  onDelete={handleDelete} // Pass the handleDelete function
                />
              ))
            ) : (
              <p>No workouts logged for today.</p>
            )}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
