import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
// export const UserSignIn = async (data) => API.post("/user/signin", data);
export const UserSignIn = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { user: { name: "Test User" }, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGM3NmE0MmExZjZlMjgxZWYxODU4NyIsImlhdCI6MTcyNTcyNDMyNCwiZXhwIjozMTcyNzAxNjY3MjR9.Fkx83CPAjfEk_xtdaKiafF0DNGYMxGoLRy2zA7r3UtU" } });
      }, 1000);
    });
  };

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });