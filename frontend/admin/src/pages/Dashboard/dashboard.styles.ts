import styled from '@emotion/styled';
export const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;


export const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CardTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
`;

export const CardValue = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

export const MetricContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;
