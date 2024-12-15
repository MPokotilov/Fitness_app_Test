import React from 'react';
import styled, { useTheme } from 'styled-components';

// Import SVG files instead of PNG
import { ReactComponent as BodyPartIcon } from '../utils/Images/body-part.svg';
import { ReactComponent as TargetIcon } from '../utils/Images/target.svg';
import { ReactComponent as EquipmentIcon } from '../utils/Images/equipment.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};

  @media (min-width: 992px) {
    flex-direction: row;
    padding: 50px;
  }
    
`;

const ImageWrapper = styled.div`
  flex: 1;
  max-width: 450px;
  margin-bottom: 20px;

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (min-width: 992px) {
    margin-bottom: 0;
    margin-right: 50px;
  }
`;

const InfoWrapper = styled.div`
  flex: 1;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.primary};
    text-transform: capitalize;

    @media (min-width: 992px) {
      font-size: 3.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 40px;
    color: ${({ theme }) => theme.text_secondary};

    @media (min-width: 992px) {
      font-size: 1.4rem;
    }
  }
`;

const ExtraDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  .icon-button {
    background-color: ${({ theme }) => theme.bgLight};
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px ${({ theme }) => theme.shadow};
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.primaryLight};
    }

    svg {
      width: 40px;
      height: 40px;
      fill: ${({ theme }) => theme.primary}; /* Apply the theme's primary color */
    }
  }

  span {
    font-size: 1.6rem;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text_primary};

    @media (min-width: 992px) {
      font-size: 1.8rem;
    }
  }
`;

const Detail = ({ exerciseDetail }) => {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;

  const extraDetail = [
    {
      icon: <BodyPartIcon />,
      name: bodyPart,
    },
    {
      icon: <TargetIcon />,
      name: target,
    },
    {
      icon: <EquipmentIcon />,
      name: equipment,
    },
  ];

  return (
    <Container>
      <ImageWrapper>
        <img src={gifUrl} alt={name} loading="lazy" />
      </ImageWrapper>
      <InfoWrapper>
        <h1>{name}</h1>
        <p>
          Exercises keep you strong. <span>{name}</span> is one of the best exercises to target your{' '}
          <span>{target}</span>. It will help you improve your mood and gain energy.
        </p>
        <ExtraDetail>
          {extraDetail.map((item) => (
            <DetailItem key={item.name}>
              <div className="icon-button">
                {item.icon}
              </div>
              <span>{item.name}</span>
            </DetailItem>
          ))}
        </ExtraDetail>
      </InfoWrapper>
    </Container>
  );
};

export default Detail;
