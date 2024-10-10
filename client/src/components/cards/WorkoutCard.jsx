import { AccessTimeFilled } from "@mui/icons-material";
import { ReactComponent as FitnessIcon } from "../../utils/dumbbell.svg";
import React from "react";
import styled from "styled-components"; 

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 12px 14px;
  }
`;
const Category = styled.div`
  width: fit-content;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  background: ${({ theme }) => theme.primary + 20};
  padding: 4px 10px;
  border-radius: 8px;
`;
const Name = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
`;
const Sets = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  display: flex;
  gap: 6px;
`;
const Flex = styled.div`
  display: flex;
  gap: 16px;
`;
const Details = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DeleteButton = styled.button`
  background: red;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + 20};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
`;

const WorkoutCard = ({ workout, onDelete }) => {
    const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this workout?")) {
        onDelete(workout._id); // Simply call the onDelete prop with the workout ID
      }
    };
  
    return (
      <Card>
        <DeleteButton onClick={handleDelete}>X</DeleteButton>
        <Category>#{workout?.category}</Category>
        <Name>{workout?.workoutName}</Name>
        <Sets>
          Count: {workout?.sets} sets X {workout?.reps} reps
        </Sets>
        <Flex>
          <Details>
            <FitnessIcon
              style={{
                width: "20px",
                height: "20px",
                filter: "drop-shadow(0 0 5px white)",
              }}
            />
            {workout?.weight} kg
          </Details>
          <Details>
            <AccessTimeFilled sx={{ fontSize: "20px" }} />
            {workout?.duration} min
          </Details>
        </Flex>
      </Card>
    );
  };
  
  export default WorkoutCard;
