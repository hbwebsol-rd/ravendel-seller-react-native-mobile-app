import styled from 'styled-components';
import Colors from '../../../utils/color';

export const ProductsWrapper = styled.ScrollView`
  padding: 10px;
`;
export const ProductsCardWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 20px;
  margin-horizontal: 10px;
  flex:1;
`;
export const ProductCard = styled.TouchableOpacity`
  width: 48%;
  margin: 1%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border-color: #cdcdcd;
  border-width: 1px;
`;
export const ProductShare = styled.TouchableOpacity`
  background-color: #fff;
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 35px;
  position: absolute;
  top: 5px;
  right: 5px;
  justify-content: center;
  align-items: center;
`;
export const ProductRemove = styled.TouchableOpacity`
  background-color: #fff;
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 35px;
  position: absolute;
  top: 45px;
  right: 5px;
  justify-content: center;
  align-items: center;
`;
export const ProductCardBody = styled.View`
  background-color: #fff;
  padding: 10px;
`;
export const ProductTitle = styled.Text``;
export const ProductPriceWrapper = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;
export const ProductPrice = styled.Text`
  margin-bottom: 5px;
`;
export const ProductSellPrice = styled.Text`
  color: ${Colors.blackColor};
  margin-right: 10px;
`;
export const ProductHasSellPrice = styled.Text`
  color: #969696;
  text-decoration-line: line-through;
  font-size: 12px;
`;
export const FeatureImageWrapper = styled.View`
  background-color: #fafafa;
`;

export const ProductStatus = styled.View`
  background-color: ${props =>
    props.status === 'Publish' ? '#43a047a8' : '#b71c1ca3'};
  padding: 4px;
  width: 40%;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
export const ProductStatusText = styled.Text`
  color: #fff;
  font-size: 10px;
`;

export const AttributesWrapper = styled.ScrollView`
  padding: 10px;
`;
export const AttrCard = styled.TouchableOpacity`
  width: 100%;
  margin: 1% 0;
  padding: 10px;
  position: relative;
  background-color: #fff;
  flex-direction: row;
`;
export const AttrActionWrapper = styled.View`
  flex-direction: row;
  position: relative;
  top: 5px;
  right: 5px;
`;
export const AttrActionBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  margin-left: 5px;
`;
export const AttrName = styled.Text`
  font-size: 18px;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  font-weight: bold;
  color: ${Colors.primaryColor};
`;
export const AttrValTitle = styled.Text`
  font-weight: bold;
  color: #3a3a3a;
  margin-bottom: 5px;
`;
export const AttrVal = styled.Text`
  font-size: 14px;
`;
export const AttrValWrapper = styled.View`
  margin-top: 10px;
`;
export const AttrHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;
