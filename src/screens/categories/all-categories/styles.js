import styled from 'styled-components';
import Colors from '../../../utils/color';

export const AllCategoriesWrapper = styled.ScrollView`
  padding: 10px;
`;
export const CategoryWrapper = styled.View`
  padding: 10px;
  background: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;
export const CategoryName = styled.Text`
  color: #000;
`;
export const CategoryAction = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const CategoryEditBtn = styled.TouchableOpacity`
  padding-left: 5px;
  padding-right: 5px;
`;
export const CategoryDeleteAction = styled.TouchableOpacity`
  padding-left: 5px;
  padding-right: 5px;
`;
export const ErrorText = styled.Text``;

// export const CategoryWrapper = styled.View`
//   padding: 10px;
//   background: #fff;
//   margin-bottom: 7px;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// `;
