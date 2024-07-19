import React from 'react';
import AllBrandsView from './view';
import AppHeader from '../../components/header';
import FabBtn from '../../components/fab-btn';

const AllBrandsScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Brands" navigation={navigation} />
      <AllBrandsView navigation={navigation} />
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddBrand');
        }}
      />
    </>
  );
};

export default AllBrandsScreen;
