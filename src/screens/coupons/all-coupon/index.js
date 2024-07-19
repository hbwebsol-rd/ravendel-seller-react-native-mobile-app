import React from 'react';
import AppHeader from '../../components/header';
import AllCouponsView from './view';
import FabBtn from '../../components/fab-btn';

const AllCouponsScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Coupons" navigation={navigation} />
      <AllCouponsView navigation={navigation} />
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddCoupons');
        }}
      />
    </>
  );
};

export default AllCouponsScreen;
