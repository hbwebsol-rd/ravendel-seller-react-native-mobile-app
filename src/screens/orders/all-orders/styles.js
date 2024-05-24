import styled from 'styled-components';

export const OrdersWrapper = styled.View`
  padding: 10px;
`;
export const OrderCard = styled.TouchableOpacity`
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0 0;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  elevation: 2;
`;
export const OrderAmount = styled.Text`
  font-size: 20px;
  margin-top: 7px;
  margin-bottom: 7px;
`;
export const OrderID = styled.Text`
  font-size: 14px;
`;
export const OrderStatus = styled.Text``;
export const OrderDate = styled.Text`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
`;
export const OrderView = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  padding: 5px;
`;
