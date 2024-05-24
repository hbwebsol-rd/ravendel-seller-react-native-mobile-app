import React, {useEffect} from 'react';
import AppHeader from '../components/header';
import {ScrollView} from 'react-native';
import {
  DashbaordCardWrapper,
  DashbaordCard,
  DashbaordCardValue,
  DashbaordCardTitle,
} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {getDashboardDataAction} from '../../store/action';
import {useQuery} from '@apollo/client';
import {GET_DASHBOARDDATA} from '../../queries/userQueries';
import AppLoader from '../components/loader';
import {AppSettingAction} from '../../store/action/dashboardAction';
import {formatCurrency} from '../../utils/helper';

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error, data} = useQuery(GET_DASHBOARDDATA);
  const {currencyOptions, currencySymbol} = useSelector(
    state => state.dashboard,
  );
  console.log(
    loading,
    error,
    JSON.stringify(data?.dashboardData?.productCount),
  );
  useEffect(() => {
    dispatch(AppSettingAction());
  }, []);
  // console.log(JSON.stringify(data), 'dbb data');
  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <AppHeader title="Dashboard" navigation={navigation} />
      <ScrollView>
        <DashbaordCardWrapper>
          <DashbaordCard onPress={() => navigation.navigate('Order')}>
            <DashbaordCardTitle>Total Users</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.userCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard>
            <DashbaordCardTitle>Total Product</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.productCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard onPress={() => navigation.navigate('AllProducts')}>
            <DashbaordCardTitle>Total Customers</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.customerCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard onPress={() => navigation.navigate('AllCustomers')}>
            <DashbaordCardTitle>Total Sales</DashbaordCardTitle>
            <DashbaordCardValue>
              {formatCurrency(
                data?.dashboardData?.totalSales,
                currencyOptions,
                currencySymbol,
              )}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard
            onPress={() =>
              navigation.navigate(false ? 'ProductsScreen' : 'Test', {
                screen: 'AddProduct',
                initial: false,
              })
            }>
            <DashbaordCardTitle>Add new product</DashbaordCardTitle>
          </DashbaordCard>
        </DashbaordCardWrapper>
      </ScrollView>
    </>
  );
};

export default DashboardScreen;
