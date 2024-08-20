// api/index.js
export const UserSignUp = async (data) => {
    // Simulate a signup request with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { user: { name: "Mock User" }, token: "dummyToken" } });
      }, 1000);
    });
  };
  
  export const UserSignIn = async (data) => {
    // Simulate a login request with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { user: { name: "Mock User" }, token: "dummyToken" } });
      }, 1000);
    });
  };
  
  export const getDashboardDetails = async (token) => {
    // Simulate fetching dashboard details with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            totalCaloriesBurnt: 1200,
            totalWorkouts: 5,
            avgCaloriesBurntPerWorkout: 240,
            totalWeeksCaloriesBurnt: { weeks: ["Mon", "Tue", "Wed"], caloriesBurned: [400, 300, 500] },
            pieChartData: [{ value: 50, label: "Legs" }, { value: 30, label: "Arms" }],
          },
        });
      }, 1000);
    });
  };
  
  export const getWorkouts = async (token, date) => {
    // Simulate fetching workouts with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            todaysWorkouts: [
              { category: "Legs", workoutName: "Squats", sets: 4, reps: 12, weight: 80, duration: 45 },
              { category: "Arms", workoutName: "Bicep Curls", sets: 3, reps: 10, weight: 20, duration: 30 },
            ],
          },
        });
      }, 1000);
    });
  };
  
  export const addWorkout = async (token, data) => {
    // Simulate adding a workout with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: "Workout added successfully" } });
      }, 1000);
    });
  };
  