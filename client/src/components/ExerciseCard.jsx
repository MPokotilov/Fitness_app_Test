import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import styled, { useTheme } from 'styled-components';

// Styled components for customization
const CardLink = styled(Link)`
  text-decoration: none;
  width: 300px;
  margin: 20px;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 4px 6px ${({ theme }) => theme.shadow};
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 250px;
  background-color: ${({ theme }) => theme.bgLight}; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExerciseImage = styled.img`
  width: 100%; 
  height: 100%; 
  object-fit: contain;
`;

const ExerciseInfo = styled.div`
  padding: 16px;
`;

const ExerciseCard = ({ exercise }) => {
  const theme = useTheme(); // Access the theme object

  return (
    <CardLink to={`/exercise/${exercise.id}`}>
      <ImageContainer>
        <ExerciseImage
          src={exercise.gifUrl}
          alt={exercise.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'placeholder_image_url'; // Replace with your placeholder image URL or path
          }}
        />
      </ImageContainer>
      <ExerciseInfo>
        <Stack direction="row" spacing={1} mb={1}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.primary,
              color: theme.white,
              borderRadius: '20px',
              textTransform: 'capitalize',
              fontSize: '14px',
              padding: '5px 10px',
              '&:hover': {
                backgroundColor: theme.primaryHover || theme.primary,
              },
            }}
          >
            {exercise.bodyPart}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.secondary,
              color: theme.white,
              borderRadius: '20px',
              textTransform: 'capitalize',
              fontSize: '14px',
              padding: '5px 10px',
              '&:hover': {
                backgroundColor: theme.secondaryHover || theme.secondary,
              },
            }}
          >
            {exercise.target}
          </Button>
        </Stack>
        <Typography
          variant="h6"
          color={theme.text_primary}
          fontWeight="bold"
          textTransform="capitalize"
          sx={{ fontSize: { lg: '18px', xs: '16px' } }}
        >
          {exercise.name}
        </Typography>
      </ExerciseInfo>
    </CardLink>
  );
};

export default ExerciseCard;
