import styled from 'styled-components';

export const DashbaordCardWrapper = styled.View`
  flex-wrap: wrap;
  flex: 1;
  flex-direction: row;
  padding: 10px;
`;
export const DashbaordCard = styled.TouchableOpacity`
  background-color: #fff;
  width: 48%;
  margin: 1.5% 1%;
  padding: 10px;
`;
export const DashbaordCardTitle = styled.Text`
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  color: #000;
  opacity: 0.6;
`;
export const DashbaordCardValue = styled.Text`
  font-size: 18px;
  color: #000;
`;
