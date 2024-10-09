import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

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
