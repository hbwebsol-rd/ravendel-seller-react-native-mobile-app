import React from 'react';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import Colors from '../../utils/color';
import { APP_NAME } from '../../utils/helper';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const AView = styled.View`
  flex: 1;
  height: ${windowHeight}px;
  width: ${windowWidth}px;
  background-color: ${Colors.primaryColor};
  justify-content: center;
  align-items: center;
`;
const AText = styled.Text`
  color: #fff;
  margin-top: 10px;
  font-size: 18px;
  text-transform: uppercase;
`;

const SplashScreen = () => {
  return (
    <AView>
      <AText>{APP_NAME}</AText>
    </AView>
  );
};

export default SplashScreen;
