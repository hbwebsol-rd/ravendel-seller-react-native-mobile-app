import React from 'react';
import AppHeader from '../../components/header';
import AllAttributesView from './view';
import FabBtn from '../../components/fab-btn';

const AllAttributesScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Attributes" navigation={navigation} />
      <AllAttributesView navigation={navigation} />
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddAttribute');
        }}
      />
    </>
  );
};

export default AllAttributesScreen;
