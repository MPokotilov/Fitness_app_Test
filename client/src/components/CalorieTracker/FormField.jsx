import styled from 'styled-components';

const FormField = ({ label, type, value, onChange, placeholder, options, onKeyDown, min }) => {
  return (
    <div>
      <Label>{label}</Label>
      {type === 'select' ? (
        <StyledSelect value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
      ) : (
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          min={min}
        />
      )}
    </div>
  );
};

export default FormField;



const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary};
  display: block; 
`;

const Input = styled.input`
  padding: 12px 15px;
  width: 100%; 
  border: 1px solid #d1d3e2;
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight};
  box-sizing: border-box; 
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bgLight};
  }
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  width: 100%; 
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.card};
  box-sizing: border-box; 
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.bgLight};
  }
`;
