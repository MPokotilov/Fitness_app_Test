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

export const deleteWorkout = async (req, res, next) => {
    try {
        console.log(req.params);
      const { workoutId } = req.params; // Capture workout ID from the URL
      const userId = req.user?.id; // Get user ID from the JWT token
      
      // Verify if the workout belongs to the user and delete it
      const result = await Workout.findOneAndDelete({
        _id: workoutId,
        user: userId,
      });
  
      if (!result) {
        return res.status(404).json({ message: "Workout not found or not authorized" });
      }
  
      res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
      next(error);
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
      const { date, category, exerciseName, sets, reps, weight, time } = req.body;
  
      const workoutDate = date ? new Date(date) : new Date();
      if (isNaN(workoutDate)) {
        return next(createError(400, "Invalid date format"));
      }
  
      // Validation for required fields
      if (!category) {
        return next(createError(400, "Category is required"));
      }
      if (!exerciseName) {
        return next(createError(400, "Exercise name is required"));
      }
      if (sets === undefined) {
        return next(createError(400, "Number of sets is required"));
      }
      if (reps === undefined) {
        return next(createError(400, "Number of reps is required"));
      }
      if (weight === undefined) {
        return next(createError(400, "Weight is required"));
      }
      if (time === undefined) {
        return next(createError(400, "Time is required"));
      }
  
      const workoutData = {
        user: userId,
        date: workoutDate,
        category,
        workoutName: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        duration: parseFloat(time),
        caloriesBurned: calculateCaloriesBurnt({
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          time: parseFloat(time),
        }),
      };
  
      await Workout.updateOne(
        {
          user: userId,
          workoutName: exerciseName,
          date: {
            $gte: new Date(workoutDate.setHours(0, 0, 0, 0)),
            $lte: new Date(workoutDate.setHours(23, 59, 59, 999)),
          },
        },
        { $set: workoutData },
        { upsert: true }
      );
  
      return res.status(200).json({ message: "Workout added or updated successfully." });
    } catch (err) {
      next(err);
    }
  };

  export const updateUserEmail = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { email } = req.body;
  
      // Check if the user is authorized
      if (userId !== req.user.id) {
        return next(createError(403, "You are not authorized to update this user's email"));
      }
  
      // Validate new email
      if (!email) {
        return next(createError(400, "Email is required"));
      }
  
      // Check if the new email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(createError(409, "Email is already in use"));
      }
  
      // Update the email
      await User.findByIdAndUpdate(userId, { email });
      return res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
      return next(error);
    }
  };
  
  // Update User Password
  export const updateUserPassword = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { currentPassword, password } = req.body;
  
      // Check if the user is authorized
      if (userId !== req.user.id) {
        return next(createError(403, "You are not authorized to update this user's password"));
      }
  
      // Validate passwords
      if (!currentPassword || !password) {
        return next(createError(400, "Current and new passwords are required"));
      }
  
      // Fetch user data
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      // Verify current password
      const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return next(createError(403, "Current password is incorrect"));
      }
  
      // Hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      // Update the password
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return next(error);
    }
  };
  
  // Update User Name
  export const updateUserName = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { name } = req.body;
  
      // Check if the user is authorized
      if (userId !== req.user.id) {
        return next(createError(403, "You are not authorized to update this user's name"));
      }
  
      // Validate new name
      if (!name) {
        return next(createError(400, "Name is required"));
      }
  
      // Update the name
      await User.findByIdAndUpdate(userId, { name });
      return res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
      return next(error);
    }
  };

  const calculateCaloriesBurnt = ({ sets, reps, weight, time }) => {
    const loadCoefficient = 0.05;      
    const timeCoefficient = 3;        
    const intensityCoefficient = 1.2; 
    
    const caloriesFromLoad = weight * sets * reps * loadCoefficient;
    
    const adjustedTime = time * (1 + (reps / 20)); 
    const caloriesFromTime = adjustedTime * timeCoefficient * intensityCoefficient;

    return Math.round(caloriesFromLoad + caloriesFromTime);
};
