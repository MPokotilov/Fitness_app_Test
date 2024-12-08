import {
    updateUserEmail,
    updateUserPassword,
    updateUserName,
    UserSignUp,
    UserSignIn,
    getDashboardDetails,
    getPreviousDayDetails,
    deleteWorkout,
    getWorkouts,
    addWorkout,
  } from "../api";
  import axios from "axios";
  
  jest.mock("axios");
  
  describe("API Tests", () => {
    const token = "testToken";
    const userId = "testUser";
    const mockResponse = { data: "success" };
  
    it("should update user email", async () => {
      axios.patch.mockResolvedValue(mockResponse);
      const result = await updateUserEmail(userId, "newEmail@example.com", token);
      expect(result).toEqual(mockResponse);
      expect(axios.patch).toHaveBeenCalledWith(
        `/user/${userId}/email`,
        { email: "newEmail@example.com" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });
  
    it("should sign up a user", async () => {
      axios.post.mockResolvedValue(mockResponse);
      const result = await UserSignUp({ name: "John", email: "john@example.com", password: "1234" });
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith("/user/signup", { name: "John", email: "john@example.com", password: "1234" });
    });
  
    // Add more tests for each API function...
  });
  