import React, {useState, useEffect} from 'react';
import SingleCustomerView from './view';
import AppHeader from '../../components/header';

const ViewCustomerScreen = ({navigation, route}) => {
  const [singleCustomerDetail, setSingleCustomerDetail] = useState({});

  useEffect(() => {
    if (route.params && route.params.singleCustomer) {
      console.log('route.params.singleCustomer', route.params.singleCustomer);
      setSingleCustomerDetail(route.params.singleCustomer);
    }
  }, [route.params]);

  return (
    <>
      <AppHeader title="View Customer" navigation={navigation} back />
      <SingleCustomerView
        navigation={navigation}
        singleCustomerDetail={singleCustomerDetail}
      />
    </>
  );
};

export default ViewCustomerScreen;
