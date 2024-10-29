import styled from 'styled-components';

export const ViewCustomerWrapper = styled.ScrollView`
  padding: 10px;
`;

export const CustomerProfileRow = styled.View`
  padding: 10px 0;
`;
export const CustomerProfileLable = styled.Text`
  width: 125px;
  font-size: 16px;
  color: #000;
`;
export const CustomerProfileValue = styled.Text`
  font-size: 16px;
  color: #000;
  text-transform:capitalize;
`;
export const CustomerEmailValue = styled.Text`
  font-size: 16px;
  color: #000;
`;
export const AddressTitle = styled.Text`
  font-size: 16px;
  margin-top: 20px;
  color: #000;
`;
export const AddressWrapper = styled.View`
  background-color: #fff;
  padding: 10px;
  margin-top: 7px;
  margin-bottom: 7px;
`;
export const AddressRow = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;
export const AddressLabel = styled.Text`
  width: 40px;
`;
export const AddressValue = styled.Text`
  font-size: 14px;
  flex-wrap: wrap;
  width: 90%;
  color: #505050;
  text-transform:capitalize;
`;
export const DefaultAddress = styled.Text`
  align-self: flex-end;
`;
