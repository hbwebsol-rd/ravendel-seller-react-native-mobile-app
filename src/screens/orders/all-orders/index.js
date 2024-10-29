import React from 'react';
import AppHeader from '../../components/header';
import AllOrderView from './view';

const AllOrdersScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Orders" navigation={navigation} />
      <AllOrderView navigation={navigation} />
    </>
  );
};

export default AllOrdersScreen;
