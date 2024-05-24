import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/color';

const FabBtn = ({onPressFunc}) => {
  return (
    <CustomFAB onPress={() => onPressFunc()}>
      <Icon name={'plus'} size={24} color={'#fff'} />
    </CustomFAB>
  );
};

const CustomFAB = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${Colors.primaryColor};
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 50px;
  height: 45px;
  width: 45px;
  justify-content: center;
  align-items: center;
`;

export default FabBtn;
