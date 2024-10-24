import React, { createContext, useContext, useState } from "react";

// Create Context
const WeightUnitContext = createContext();

export const WeightUnitProvider = ({ children }) => {
  const [weightUnit, setWeightUnit] = useState("kg");

  // Toggle the weight unit between kg and lbs
  const toggleWeightUnit = () => {
    setWeightUnit((prevUnit) => (prevUnit === "kg" ? "lbs" : "kg"));
  };

  // Convert weight based on the current unit
  const convertWeight = (weight) => {
    if (weightUnit === "kg") {
      return weight; // Keep as is for kg
    } else {
      return (weight * 2.20462).toFixed(2); // Convert kg to lbs
    }
  };

  return (
    <WeightUnitContext.Provider value={{ weightUnit, toggleWeightUnit, convertWeight }}>
      {children}
    </WeightUnitContext.Provider>
  );
};

export const useWeightUnit = () => useContext(WeightUnitContext);
