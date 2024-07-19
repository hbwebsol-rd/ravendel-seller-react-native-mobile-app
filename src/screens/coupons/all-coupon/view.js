import React from 'react';
import {Alert, FlatList, Text} from 'react-native';
import {
  CouponCardWrapper,
  CouponCard,
  CouponCardTitle,
  CouponCardFooter,
  CouponCardBody,
  ValidUntil,
  CouponCardFooterAction,
  CouponCardFooterActionBtn,
  CouponCode,
} from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import ThemeColor from '../../../utils/color';
import {Query, useQuery} from '@apollo/client';
import {GET_COUPONS} from '../../../queries/couponQueries';
import AppLoader from '../../components/loader';
import {useIsFocused} from '@react-navigation/native';
import {DELETE_COUPON} from '../../../queries/couponQueries';
import {useMutation} from '@apollo/client';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {formatCurrency} from '../../../utils/helper';

const AllCouponsView = ({navigation}) => {
  const isFocused = useIsFocused();

  const {loading, error, data, refetch} = useQuery(GET_COUPONS);
  const {currencyOptions, currencySymbol} = useSelector(
    state => state.dashboard,
  );
  const [deleteCoupon, {loading: deleteLoading}] = useMutation(DELETE_COUPON, {
    onError: error => {
      // Handle error
      console.error(error);
    },
    onCompleted: data => {
      // Handle completion
      console.log('Deleted successfully');
      refetch();
    },
  });

  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (loading) {
    return <AppLoader />; // Replace with your loading component
  }

  if (error) {
    console.error(error);
    return <Text>Something went wrong. Please try again later</Text>;
  }

  const coupons = data.coupons.data;

  const Item = ({coupon, i}) => (
    <>
      <CouponCard key={i}>
        <CouponCardBody
          Expired={
            moment(coupon.expire).format('l') < moment(new Date()).format('l')
          }>
          <CouponCode>{coupon.code}</CouponCode>
          <CouponCardTitle>
            {coupon.discountType === 'precantage-discount'
              ? `${coupon.discountValue}%`
              : null}
            {coupon.discountType === 'amount-discount'
              ? formatCurrency(
                  coupon.discountValue,
                  currencyOptions,
                  currencySymbol,
                )
              : null}{' '}
            off
          </CouponCardTitle>
        </CouponCardBody>
        <CouponCardFooter
          Expired={
            moment(coupon.expire).format('l') < moment(new Date()).format('l')
          }>
          <ValidUntil
            Expired={
              moment(coupon.expire).format('l') < moment(new Date()).format('l')
            }>
            {moment(coupon.expire).format('l') < moment(new Date()).format('l')
              ? `Expired: ${moment(coupon.expire).format('LL')}`
              : `Valid until: ${moment(coupon.expire).format('LL')}`}
          </ValidUntil>
          <CouponCardFooterAction>
            <CouponCardFooterActionBtn
              onPress={() => {
                navigation.navigate('EditCoupon', {singleCoupon: coupon});
              }}>
              <Icon name="pencil" size={15} color="#000" />
            </CouponCardFooterActionBtn>
            <CouponCardFooterActionBtn
              onPress={() => {
                Alert.alert(
                  'Are you sure?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () =>
                      {
                        deleteCoupon({
                          variables: {id: coupon.id},
                        })
                      }
                    },
                  ],
                  {cancelable: false},
                );
              }}>
              <Icon name="trash" size={15} color={ThemeColor.deleteColor} />
            </CouponCardFooterActionBtn>
          </CouponCardFooterAction>
        </CouponCardFooter>
      </CouponCard>
    </>
  );

  const renderItem = ({item, i}) => <Item coupon={item} i={i} />;

  return (
    <MainContainer>
      <CouponCardWrapper>
        {deleteLoading ? <AppLoader /> : null}
        {coupons.length ? (
          <>
            <FlatList
              initialNumToRender={10}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              data={coupons}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      alignSelf: 'center',
                      color: 'grey',
                    }}>
                    No Records Found
                  </Text>
                </View>
              )}
            />
          </>
        ) : (
          ''
        )}
      </CouponCardWrapper>
    </MainContainer>
  );
};

export default AllCouponsView;
