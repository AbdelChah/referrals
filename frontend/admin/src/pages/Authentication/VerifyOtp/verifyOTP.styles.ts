import styled from '@emotion/styled';

export const OTPContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px; /* Space between the input fields */
  margin: 20px 0;
`;

export const OTPInput = styled.input`
  width: 50px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &:invalid {
    border-color: #dc3545;
  }
`;

export const SubmitButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;
