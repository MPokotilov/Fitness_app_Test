import React from 'react';
import styled from 'styled-components';

const SelectField = ({ label, value, options, onChange }) => {
  return (
    <div>
      <Label>{label}</Label>
      <StyledSelect value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

export default SelectField;

// Стили

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary};
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.card};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bgLight};
  }

  option {
    color: ${({ theme }) => theme.text_primary};
    background-color: ${({ theme }) => theme.bg};
  }
`;
