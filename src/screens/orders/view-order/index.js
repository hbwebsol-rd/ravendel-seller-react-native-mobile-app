import React from 'react';
import AppHeader from '../../components/header';
import OrderView from './view';

const ViewOrderScreen = ({navigation, route}) => {
  // const orderDetail = route?.params?.orderDetail;
  const id = route?.params?.id;
  return (
    <>
      <AppHeader title="View Order" navigation={navigation} back />
      <OrderView id={id} />
    </>
  );
};

export default ViewOrderScreen;
