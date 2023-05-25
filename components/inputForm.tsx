import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Label = styled.label`
  position: absolute;
  top: ${(props) => (props.hasValue ? '-12px' : '12px')};
  left: 12px;
  color: ${(props) => (props.hasValue ? '#888' : '#555')};
  transition: top 0.2s, font-size 0.2s, color 0.2s;
  pointer-events: none;
  font-size: ${(props) => (props.hasValue ? '12px' : '16px')};
`;

const Input = styled.input`
  width: 300px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

const ResponsiveForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <FormContainer>
      <InputContainer>
        <Label hasValue={name.length > 0}>Name</Label>
        <Input type="text" value={name} onChange={handleNameChange} />
      </InputContainer>
      <InputContainer>
        <Label hasValue={email.length > 0}>Email</Label>
        <Input type="email" value={email} onChange={handleEmailChange} />
      </InputContainer>
    </FormContainer>
  );
};

export default ResponsiveForm;
