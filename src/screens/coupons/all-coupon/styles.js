import styled from 'styled-components';

export const CouponCardWrapper = styled.ScrollView``;
export const CouponCard = styled.View`
  width: 100%;
  margin: 1% 0;
  padding: 10px;
`;
export const CouponCardBody = styled.View`
  background-color: ${(props) => (props.Expired ? '#1540505e' : '#f08080')};
  padding: 10px;
  position: relative;
`;
export const CouponCardFooter = styled.View`
  background-color: ${(props) => (props.Expired ? '#1540505e' : '#fff')};
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const CouponCardFooterAction = styled.View`
  flex-direction: row;
`;
export const CouponCardFooterActionBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  margin-left: 5px;
`;
export const CouponCardTitle = styled.Text`
  font-size: 18px;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  color: #fff;
  font-weight: bold;
`;
export const CouponCode = styled.Text`
  font-size: 14px;
  color: #fff;
  opacity: 0.5;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
`;
export const CouponCardValue = styled.Text`
  font-size: 14px;
  color: #eee;
`;
export const ValidUntil = styled.Text`
  font-size: 12px;
  opacity: 0.9;
  color: ${(props) => (props.Expired ? '#fff' : '#000')};
`;
export const Applied = styled.Text`
  color: #fff;
  font-weight: bold;
`;
export const CouponCardApplied = styled.View`
  margin-top: 10px;
`;
