import React, {useState, useEffect} from 'react';
import AppHeader from '../../components/header';
import EditCouponsForm from './view';

const EditCouponsScreen = ({route, navigation}) => {
  const [singleCouponDetail, setSingleCouponDetail] = useState({});

  useEffect(() => {
    if (route.params && route.params.singleCoupon) {
      setSingleCouponDetail(route.params.singleCoupon);
    }
  }, [route.params]);

  return (
    <>
      <AppHeader title="Edit Coupon" navigation={navigation} back />
      <EditCouponsForm
        navigation={navigation}
        singleCouponDetail={singleCouponDetail}
      />
    </>
  );
};

export default EditCouponsScreen;
