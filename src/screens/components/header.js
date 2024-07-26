import React from 'react';
import {StatusBar} from 'react-native';
import {Header} from '@rneui/themed';
import Colors from '../../utils/color';
import {View} from 'react-native';
// import InternetConnectivity from './internet-connectivity';
import Styles from '../common-styles';

const AppHeader = ({title, navigation, back}) => {
  const handlePress = () => {
    if (back) {
      navigation.goBack();
    } else {
      navigation.openDrawer();
    }
  };
  return (
    <>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header
        backgroundColor={'#154050'}
        leftComponent={{
          icon: back ? 'chevron-left' : 'menu',
          color: '#fff',
          onPress: handlePress,
          size: 28,
        }}
        centerComponent={{text: title, style: {color: '#fff', fontSize: 18}}}
        containerStyle={{borderBottomColor: Colors.primaryColor}}
      />
      <View style={Styles.headerSepratorWrapper}>
        <View style={Styles.headerSeprator} />
      </View>
      {/* <InternetConnectivity /> */}
    </>
  );
};

export default AppHeader;
