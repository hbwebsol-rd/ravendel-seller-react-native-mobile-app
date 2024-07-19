import styled from 'styled-components';
import Colors from '../../../utils/color';

export const OrdersWrapper = styled.ScrollView`
  padding: 10px;
`;
export const OrderViewCard = styled.View`
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
`;
export const OrderViewCardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: ${Colors.primaryColor};
  margin-bottom: 10px;
`;
export const OrderInfoRow = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
`;
export const OrderInfoLabel = styled.Text`
  width: 125px;
  color: #000;
`;
export const OrderInfoVal = styled.Text`
  color: #000;
`;
export const ShippingName = styled.Text`
  font-weight: bold;
  margin-bottom: 3px;
  color: #000;
`;
export const ShippingDetails = styled.Text`
  margin-bottom: 3px;
  color: #000;
`;
export const OrderDetailRow = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom-width: 0.5px;
  border-color: #858686;
`;
export const OrderDetailLeftCol = styled.View``;
export const OrderDetailRightCol = styled.View``;
export const ProductName = styled.Text`
  color: #000;
`;
export const ProductQty = styled.Text`
  color: #858686;
`;
export const ProductPrice = styled.Text`
  color: #000;
`;

export const OrderAmountRow = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
`;
export const OrderAmountLabel = styled.Text`
  width: 200px;
  text-align: right;
  color: #000;
`;
export const OrderAmountValue = styled.Text`
  flex: 1;
  text-align: right;
  color: #000;
`;
