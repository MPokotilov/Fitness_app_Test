import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
    try {
      console.log('Request Body:', req.body);  // Log the whole body
  
      const { email, password, name, img } = req.body;
      console.log('Extracted Password:', password);  // Log the extracted password
  
      if (!password) {
        return next(createError(400, "Password is required"));
      }
  
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return next(createError(409, "Email is already in use."));
      }
  
      const salt = bcrypt.genSaltSync(10);
      console.log('Generated Salt:', salt);
  
      const hashedPassword = bcrypt.hashSync(password, salt);
      console.log('Hashed Password:', hashedPassword);
  
      const user = new User({
          name,
          email,
          password: hashedPassword,
          img,
      });
      const createdUser = await user.save();
      const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
        expiresIn: "9999 years",
      });
      return res.status(200).json({ token, user });
    } catch (error) {
      return next(error);
    }
  };
  

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      console.log('User ID:', userId);
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      // Check if previous day data is requested
      let currentDate = new Date();
      if (req.query.date === 'previousDay') {
        currentDate.setDate(currentDate.getDate() - 1);  // Move back to the previous day
      }
  
      const startToday = new Date(currentDate.setHours(0, 0, 0, 0));
      const endToday = new Date(currentDate.setHours(23, 59, 59, 999));
  
      // Calculate total calories burnt
      const totalCaloriesResult = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
        {
          $group: {
            _id: null,
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      const totalCaloriesBurnt = totalCaloriesResult.length > 0 ? totalCaloriesResult[0].totalCaloriesBurnt : 0;
  
      // Calculate total number of workouts
      const totalWorkouts = await Workout.countDocuments({
        user: userId,
        date: { $gte: startToday, $lte: endToday },
      });
  
      // Calculate average calories burnt per workout
      const avgCaloriesBurntPerWorkout = totalWorkouts > 0 ? (totalCaloriesBurnt / totalWorkouts) : 0;
  
      // Fetch category of workouts
      const categoryCalories = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
        {
          $group: {
            _id: "$category",
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      // Format category data for pie chart
      const pieChartData = categoryCalories.map((category, index) => ({
        id: index,
        value: category.totalCaloriesBurnt,
        label: category._id,
      }));
  
      // Prepare weekly calories burnt data
      const weeks = [];
      const caloriesBurnt = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weeks.push(`${date.getDate()}th`);
  
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
        const weekData = await Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfDay, $lte: endOfDay },
            },
          },
          {
            $group: {
              _id: null,
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
        ]);
  
        caloriesBurnt.push(weekData.length > 0 ? weekData[0].totalCaloriesBurnt : 0);
      }
  
      return res.status(200).json({
        totalCaloriesBurnt,
        totalWorkouts,
        avgCaloriesBurntPerWorkout,
        totalWeeksCaloriesBurnt: {
          weeks,
          caloriesBurned: caloriesBurnt,
        },
        pieChartData,
      });
    } catch (err) {
      console.log('Error fetching user dashboard:', err);
      next(err);
    }
  };
  


  export const getWorkoutsByDate = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      const date = req.query.date ? new Date(req.query.date) : new Date();
      
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
      const todaysWorkouts = await Workout.find({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });
  
      const totalCaloriesBurnt = todaysWorkouts.reduce(
        (total, workout) => total + (workout.caloriesBurned || 0),
        0
      );
  
      return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
    } catch (err) {
      next(err);
    }
  };
  


  export const addWorkout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { workoutString, date } = req.body;
  
      if (!workoutString) {
        return next(createError(400, "Workout string is missing"));
      }
  
      const workoutDate = date ? new Date(date) : new Date();
  
      const parsedWorkouts = parseWorkoutString(workoutString);
  
      for (const workout of parsedWorkouts) {
        workout.caloriesBurned = calculateCaloriesBurnt(workout);
        workout.user = userId;
        workout.date = workoutDate;
  
        await Workout.updateOne(
          {
            user: userId,
            workoutName: workout.workoutName,
            date: {
              $gte: new Date(workoutDate.setHours(0, 0, 0, 0)),
              $lte: new Date(workoutDate.setHours(23, 59, 59, 999)),
            },
          },
          { $set: workout },
          { upsert: true }
        );
      }
  
      return res.status(200).json({
        message: "Workouts successfully added or updated.",
      });
    } catch (err) {
      next(err);
    }
  };
  

const parseWorkoutString = (workoutString) => {
  const workouts = workoutString.split(";").map((w) => w.trim()).filter(Boolean);
  const parsedWorkouts = [];
  let currentCategory = "";

  workouts.forEach((workoutBlock) => {
    const lines = workoutBlock.split("\n").map((line) => line.trim()).filter(Boolean);

    if (lines[0].startsWith("#")) {
      currentCategory = lines[0].substring(1).trim();
      lines.shift();
    }

    const workoutDetails = parseWorkoutLines(lines);
    if (workoutDetails) {
      workoutDetails.category = currentCategory;
      parsedWorkouts.push(workoutDetails);
    }
  });

  return parsedWorkouts;
};

const parseWorkoutLines = (lines) => {
  if (lines.length >= 4) {
    const details = {};
    details.workoutName = lines[0];
    const setsRepsMatch = lines[1].match(/(\d+)\s*sets\s*X\s*(\d+)\s*reps/i);
    if (setsRepsMatch) {
      details.sets = parseInt(setsRepsMatch[1]);
      details.reps = parseInt(setsRepsMatch[2]);
    } else {
      details.sets = 0;
      details.reps = 0;
    }
    const weightMatch = lines[2].match(/(\d+\.?\d*)\s*kg/i);
    details.weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
    const durationMatch = lines[3].match(/(\d+\.?\d*)\s*min/i);
    details.duration = durationMatch ? parseFloat(durationMatch[1]) : 0;
    return details;
  }
  return null;
};

const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = workoutDetails.duration || 0;
  const weightInKg = workoutDetails.weight || 0;
  const caloriesBurntPerMinute = 0.7;
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};
