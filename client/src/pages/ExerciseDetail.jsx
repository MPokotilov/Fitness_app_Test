import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, exerciseOptions } from '../utils/exerciseApi';
import Detail from '../components/Detail';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Full screen height */
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  text-align: center;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 8px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
`;

const ExerciseDetail = () => {
  const { id } = useParams(); // Get the exercise ID from the URL
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const exerciseDbUrl = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;
        const exerciseData = await fetchData(exerciseDbUrl, exerciseOptions);
        setExerciseDetail(exerciseData);
      } catch (error) {
        console.error('Error fetching exercise detail:', error);
        setError('An error occurred while fetching exercise details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [id]);

  if (loading) {
    return (
      <LoadingContainer>
        Loading exercise details...
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <div>
      {exerciseDetail && <Detail exerciseDetail={exerciseDetail} />}
    </div>
  );
};

export default ExerciseDetail;
