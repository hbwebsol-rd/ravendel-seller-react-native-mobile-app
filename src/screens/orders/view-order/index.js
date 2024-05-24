import React from 'react';
import AppHeader from '../../components/header';
import OrderView from './view';

const ViewOrderScreen = ({navigation, route}) => {
  const orderDetail = route?.params?.orderDetail;
  return (
    <>
      <AppHeader title="Orders" navigation={navigation} back />
      <OrderView orderDetail={orderDetail} />
    </>
  );
};

export default ViewOrderScreen;
