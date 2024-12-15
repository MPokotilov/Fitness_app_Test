import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { fetchData, exerciseOptions } from '../utils/exerciseApi';
import Button from '../components/Button';
import ExerciseCard from '../components/cards/ExerciseCard';
import debounce from 'lodash.debounce';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.primary};
`;

const SearchBarContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: transparent;
  padding: 10px 0;
  z-index: 5;
  width: 80%; 
  margin: 0 auto;

  @media (max-width: 600px) {
    width: 90%; 
    padding: 8px 0; 
`;


const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch; 
  position: relative;
`;

const InputContainer = styled.div`
  position: relative;
  margin-right: 10px; 
  width: 50%; 
  height: 55px; 
`;

const Input = styled.input`
  padding: 0 10px;
  width: 100%;
  height: 100%; 
  border: 1px solid ${({ theme }) => theme.text_primary};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  box-sizing: border-box; 
`;

const SuggestionsList = styled.ul`
  width: 100%;
  max-height: 200px;
  margin-top: 0;
  padding: 0;
  list-style-type: none;
  background-color: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.text_primary};
  border-radius: 5px;
  overflow-y: auto;
  position: absolute;
  top: 100%; 
  z-index: 1000;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const ExercisesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 5%;
`;

const ExercisesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: red;
`;

const Exercises = () => {
  // State variables
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // State for suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [allExerciseNames, setAllExerciseNames] = useState([]);

  // Fetch all exercise names once
  useEffect(() => {
    const fetchAllExerciseNames = async () => {
      try {
        const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com/exercises?limit=0';
        const exercisesData = await fetchData(exerciseDbUrl, exerciseOptions);
        if (exercisesData) {
          const names = exercisesData.map((exercise) => exercise.name);
          setAllExerciseNames(names);
        }
      } catch (error) {
        console.error('Error fetching all exercise names:', error);
      }
    };

    fetchAllExerciseNames();
  }, []);

  // Function to fetch suggestions locally
  const fetchSuggestions = (value) => {
    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = allExerciseNames
      .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10);

    setSuggestions(filteredSuggestions);
  };

  // Debounce the fetchSuggestions function
  const debouncedFetchSuggestions = useCallback(
    debounce((value) => fetchSuggestions(value), 300),
    [allExerciseNames]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    handleSearch(suggestion); // Pass the selected suggestion
  };

  // Function to fetch exercises
  const fetchExercisesData = async (isLoadMore = false) => {
    setLoading(true);
    const exerciseDbUrl = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`;
    try {
      const exercisesData = await fetchData(exerciseDbUrl, exerciseOptions);
      if (exercisesData) {
        // Update hasMore
        if (exercisesData.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (isLoadMore) {
          setDisplayedExercises((prevExercises) => [...prevExercises, ...exercisesData]);
        } else {
          setDisplayedExercises(exercisesData);
        }
      } else {
        setError('Failed to fetch exercises.');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('An error occurred while fetching exercises.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = async (searchValue = searchTerm) => {
    setLoading(true);
    setOffset(0); // Reset offset when searching
    setSuggestions([]); // Clear suggestions
    try {
      const searchUrl = `https://exercisedb.p.rapidapi.com/exercises/name/${searchValue}`;
      const exercisesData = await fetchData(searchUrl, exerciseOptions);
      if (exercisesData) {
        // Update hasMore
        if (exercisesData.length <= limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setDisplayedExercises(exercisesData.slice(0, limit));
      } else {
        setError('No exercises found for the search term.');
        setDisplayedExercises([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error searching exercises:', error);
      setError('An error occurred while searching exercises.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more exercises
  const loadMoreExercises = async () => {
    setOffset((prevOffset) => prevOffset + limit);
    fetchExercisesData(true); // Pass true to indicate loading more exercises
  };

  // Fetch exercises when component mounts
  useEffect(() => {
    fetchExercisesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Title>Exercises Library</Title>

      <SearchBarContainer>
        <SearchBar>
          <InputContainer>
            <Input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <SuggestionsList>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
            )}
          </InputContainer>
          <Button text="Search" onClick={() => handleSearch()} />
        </SearchBar>
      </SearchBarContainer>

      <ExercisesWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && <LoadingMessage>Loading exercises...</LoadingMessage>}

        <ExercisesContainer>
          {displayedExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </ExercisesContainer>

        {!loading && hasMore && (
          <LoadMoreContainer>
            <Button text="Load More" onClick={loadMoreExercises} />
          </LoadMoreContainer>
        )}
      </ExercisesWrapper>
    </Container>
  );
};

export default Exercises;
