// tests/user.test.js
import request from "supertest";
import User from "../models/User.js";
import { app } from "./setupTests.js"; // Import app from setupTests

describe("User Registration", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  });
});

describe("User Login", () => {
  it("should login a user", async () => {
    // First, create a user via the signup endpoint
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "testlogin@example.com",
      password: "Password123",
    });
    expect(signupRes.statusCode).toEqual(200);

    // Then, attempt to login
    const res = await request(app).post("/api/user/signin").send({
      email: "testlogin@example.com",
      password: "Password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });
});

describe("Update User Email", () => {
  it("should update the user's email", async () => {
    // Register a new user
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Email Test User",
      email: "emailtest@example.com",
      password: "Password123",
    });

    const token = signupRes.body.token;
    const userId = signupRes.body.user._id;

    // Update email
    const res = await request(app)
      .patch(`/api/user/${userId}/email`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "newemail@example.com",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Email updated successfully");

    // Verify the email was updated in the database
    const user = await User.findById(userId);
    expect(user.email).toBe("newemail@example.com");
  });
});

describe("Update User Password", () => {
  it("should update the user's password", async () => {
    // Register a new user
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Password Test User",
      email: "passwordtest@example.com",
      password: "OldPassword123",
    });

    const token = signupRes.body.token;
    const userId = signupRes.body.user._id;

    // Update password
    const res = await request(app)
      .patch(`/api/user/${userId}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "OldPassword123",
        password: "NewPassword123",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Password updated successfully");

    // Verify the password was updated (by attempting login with new password)
    const loginRes = await request(app).post("/api/user/signin").send({
      email: "passwordtest@example.com",
      password: "NewPassword123",
    });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty("token");
  });
});

describe("Update User Name", () => {
  it("should update the user's name", async () => {
    // Register a new user
    const signupRes = await request(app).post("/api/user/signup").send({
      name: "Name Test User",
      email: "nametest@example.com",
      password: "Password123",
    });

    const token = signupRes.body.token;
    const userId = signupRes.body.user._id;

    // Update name
    const res = await request(app)
      .patch(`/api/user/${userId}/name`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Name updated successfully");

    // Verify the name was updated in the database
    const user = await User.findById(userId);
    expect(user.name).toBe("Updated Name");
  });
});

describe("Unauthorized Update Attempt", () => {
  it("should not allow a user to update another user's email", async () => {
    // Register first user
    const userOneRes = await request(app).post("/api/user/signup").send({
      name: "User One",
      email: "userone@example.com",
      password: "Password123",
    });

    const userOneToken = userOneRes.body.token;

    // Register second user
    const userTwoRes = await request(app).post("/api/user/signup").send({
      name: "User Two",
      email: "usertwo@example.com",
      password: "Password123",
    });

    const userTwoId = userTwoRes.body.user._id;

    // User One attempts to update User Two's email
    const res = await request(app)
      .patch(`/api/user/${userTwoId}/email`)
      .set("Authorization", `Bearer ${userOneToken}`)
      .send({
        email: "hackedemail@example.com",
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      "message",
      "You are not authorized to update this user's email"
    );
  });
});
