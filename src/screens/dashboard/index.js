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

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  // const {dashBoardData} = useSelector(state => state.dashboard);
  const {loading, error, data} = useQuery(GET_DASHBOARDDATA);
  console.log(loading, JSON.stringify(data?.dashboardData?.productCount));
  // useEffect(() => {
  //   dispatch(getDashboardDataAction());
  // }, []);
  // console.log(JSON.stringify(dashBoardData), 'dbb data');
  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <AppHeader title="Dashboard" navigation={navigation} />
      <ScrollView>
        <DashbaordCardWrapper>
          <DashbaordCard onPress={() => navigation.navigate('Order')}>
            <DashbaordCardTitle>Latest Orders</DashbaordCardTitle>
            <DashbaordCardValue>2</DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard>
            <DashbaordCardTitle>Total Income</DashbaordCardTitle>
            <DashbaordCardValue>$100000</DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard onPress={() => navigation.navigate('AllProducts')}>
            <DashbaordCardTitle>Total Products</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.productCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard onPress={() => navigation.navigate('AllCustomers')}>
            <DashbaordCardTitle>Total Customers</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.customerCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard
            onPress={() =>
              navigation.navigate('ProductsScreen', {
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
