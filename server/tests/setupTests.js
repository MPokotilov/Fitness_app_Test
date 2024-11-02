// tests/setupTests.js
import { connect, clearDatabase, closeDatabase } from "./setup.js";
import mongoose from "mongoose";

let app;

beforeAll(async () => {
  await connect(); // Connect to in-memory MongoDB
  app = (await import("../app.js")).default; // Import app after connecting to DB
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

export { app };
