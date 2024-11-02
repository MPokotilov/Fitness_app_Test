import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
<<<<<<< HEAD
// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
// });
=======

>>>>>>> 997c7b74fbea10efa72c89871393cd52c326a3a1
// Function to update user email
export const updateUserEmail = async (userId, newEmail) =>
  API.patch(`/user/${userId}/email`, { email: newEmail });

// Function to update user password
export const updateUserPassword = async (userId, { currentPassword, password }) =>
  API.patch(`/user/${userId}/password`, { currentPassword, password });


export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

// Get the current day dashboard details
export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get the previous day dashboard details
export const getPreviousDayDetails = async (token) =>
  API.get("/user/dashboard?date=previousDay", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteWorkout = async (token, workoutId) =>
    API.delete(`/user/workout/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  

// Get the workouts for a given date
export const getWorkouts = async (token, date) =>
  API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Add a new workout
export const addWorkout = async (token, data) =>
    API.post(`/user/workout`, { ...data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
