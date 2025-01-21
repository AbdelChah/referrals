import styled from '@emotion/styled';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 10% auto;
`;

export const InputField = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SelectField = styled.select`
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  min-width: 170px;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const Button = styled.button`
  background-color: #FFD740;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

export const CriteriaContainer = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

export const CriteriaLabel = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
`;

export const AddButton = styled(Button)`
  background-color: #007bff;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

export const RemoveButton = styled(Button)`
  background-color: #ff4444;
  margin-top: 10px;
  &:hover {
    background-color: #cc0000;
  }
`;

export const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;  
`;

export const DateFieldsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

export const DateField = styled.div`
  flex: 1;
`;

export const NoCriteriaMessage = styled.p`
  color: #007bff;
  font-size: 16px;
  font-style: italic;
  text-align: center;
  margin-top: 15px;
`;

export const CriteriaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
`;

export const RewardFieldsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
`;