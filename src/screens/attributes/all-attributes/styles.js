import styled from 'styled-components';
import Colors from '../../../utils/color';
import ThemeColor from '../../../utils/color';

export const AttributesWrapper = styled.ScrollView``;
export const AttrCard = styled.View`
  width: 100%;
  margin: 1% 0;
  padding: 10px;
  position: relative;
  background-color: #fff;
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
  font-size: 14px;
  letter-spacing: 0.5px;
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
  color:${ThemeColor.blackColor}
`;
export const AttrValWrapper = styled.View`
  margin-top: 10px;
`;
export const AttrHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
