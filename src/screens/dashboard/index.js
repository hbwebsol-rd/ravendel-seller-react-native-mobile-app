import React, {useEffect, useState} from 'react';
import AppHeader from '../components/header';
import {FlatList, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  DashbaordCardWrapper,
  DashbaordCard,
  DashbaordCardValue,
  DashbaordCardTitle,
} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {getDashboardDataAction} from '../../store/action';
import {useMutation, useQuery} from '@apollo/client';
import {GET_DASHBOARDDATA, SAVE_DEVICE_ID} from '../../queries/userQueries';
import AppLoader from '../components/loader';
import {AppSettingAction} from '../../store/action/dashboardAction';
import {formatCurrency, ONE_SIGNAL_APP_ID} from '../../utils/helper';
import {  OrdersWrapper,
  OrderCard,
  OrderAmount,
  OrderID,
  OrderStatus,
  OrderDate,
  OrderView, } from '../orders/all-orders/styles';
import ThemeColor from '../../utils/color';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import {OneSignal} from 'react-native-onesignal';
import { Linking } from 'react-native';

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);

  const {loading, error, data} = useQuery(GET_DASHBOARDDATA);
  const {currencyOptions, currencySymbol} = useSelector(
    state => state.dashboard,
  );
  const [addDeviceInfo, {loading: addedLoading}] = useMutation(SAVE_DEVICE_ID, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data,' data data');
    },
  });
  const save_playerid = async player_id => {
    addDeviceInfo({variables: {deviceInfo:  {
      "device_id": player_id,
      "device_type": Platform.OS.toUpperCase(),
      "app_version": "1.0"
    }}});
  };

  const setDeviceId = async () => {
    const deviceState = await OneSignal.User.pushSubscription.getIdAsync();
    // const pid = await getValue('playerid');
    console.log(deviceState, 'Plaery Id Get');
    // if (deviceState && deviceState.userId && isEmpty(pid)) {
    save_playerid(deviceState); //
    // }
  };

  const InitOneSignal = async () => {
    OneSignal.initialize(ONE_SIGNAL_APP_ID)
    OneSignal.setConsentRequired(true);
    OneSignal.setConsentGiven(true);
    
    setTimeout(() => {
      OneSignal.Notifications.requestPermission(false).then(s=>{(Array.isArray(s)&& !s[0]) || !s?setShowAlert(true):null})        
    }, 3000);
    
    setTimeout(() => {
      setDeviceId();
    }, 12000);
  };


  useEffect(()=>{
    InitOneSignal();
  },[])
  
  const getColor = type => {
    var bgcolor = '';
    // console.log(type);
    switch (type) {
      case 'inprogress':
        bgcolor = ThemeColor.orangeColor;
        break;
      case 'shipped':
        bgcolor = ThemeColor.green;
        break;
      case 'delivered':
        bgcolor = ThemeColor.green;
        break;
      case 'outfordelivery':
        bgcolor = ThemeColor.green;
        break;
      case 'processing':
        bgcolor = ThemeColor.orangeColor;
        break;
      case 'pending':
        bgcolor = ThemeColor.orangeColor;
        break;
      case 'failed':
        bgcolor = ThemeColor.redColor;
        break;
      case 'success':
        bgcolor = ThemeColor.green;
        break;
      case 'cancelled':
        bgcolor = ThemeColor.redColor;
        break;
      default:
        bgcolor = '#fff';
        break;
    }
    return bgcolor;
  };

  useEffect(() => {
    dispatch(AppSettingAction());
  }, []);
  
  const Item = ({order, i}) => (
    <>
      <OrderCard
        onPress={() => {
          navigation.navigate('ViewOrder', {id: order._id});
        }}
        style={{backgroundColor: ThemeColor.whiteColor}}
        key={i}>
        <OrderDate>{moment(order.date).format('MMMM D, YYYY H:mm')}</OrderDate>
        <OrderID>
          {order.orderNumber}
        </OrderID>
        <Text style={{color: '#000', marginTop: 8}}>
          {order.shipping.firstname + ' ' + order.shipping.lastname}
        </Text>
        <OrderStatus>{order.shipping.email}</OrderStatus>
        <OrderStatus>{order.shipping.phone}</OrderStatus>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
            <Text style={{fontSize: 10, marginRight: 8, color: '#000'}}>
              PAYMENT
            </Text>
            <View
              style={{
                ...styles.orderStatus,
                backgroundColor: getColor(order.paymentStatus),
              }}>
              <Text style={{color: ThemeColor.whiteColor, fontSize: 12}}>
                {order.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 10, marginRight: 8, color: '#000'}}>
              SHIPPING
            </Text>
            <View
              style={{
                ...styles.orderStatus,
                backgroundColor: getColor(order.shippingStatus),
              }}>
              <Text style={{color: ThemeColor.whiteColor, fontSize: 12}}>
                {order.shippingStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </OrderCard>
    </>
  );

  const renderItem = ({item, i}) => <Item order={item} i={i} />;

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <AppHeader title="Dashboard" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <DashbaordCardWrapper>
          <DashbaordCard>
            <DashbaordCardTitle>Total Users</DashbaordCardTitle>
            <DashbaordCardValue>
              {data?.dashboardData?.userCount}
            </DashbaordCardValue>
          </DashbaordCard>
          <DashbaordCard onPress={() => navigation.navigate('AllProduct')}>
            <DashbaordCardTitle>Total Product</DashbaordCardTitle>
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
          <DashbaordCard onPress={() => navigation.navigate('Order')}>
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
              navigation.navigate(true ? 'AddProduct' : 'Test', {
                screen: 'AddProduct',
                initial: false,
              })
            }>
            <DashbaordCardTitle>Add new product</DashbaordCardTitle>
          </DashbaordCard>
        </DashbaordCardWrapper>
        <Text style={{marginLeft:15,marginBottom:10,fontWeight:'bold',fontSize:16,color:'#000'}}>Latest Orders</Text>
        <FlatList
        contentContainerStyle={{marginHorizontal:15}}
          initialNumToRender={10}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          data={data?.dashboardData?.latestOrders ?? []}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                  color: 'grey',
                }}>
                No Latest Order
              </Text>
            </View>
          )}
        />
       
      </ScrollView>
      {
        showAlert?
        <TouchableOpacity activeOpacity={0.8} onPress={()=>{
          if (Platform.OS === 'ios') {
            // For iOS, opens the app's settings where users can enable notifications
            Linking.openURL('app-settings:');
          } else {
            // For Android, opens the app-specific settings page for notifications
            Linking.openSettings();
          }
        }} style={styles.alert}><Text style={{color:'black',margin:0,padding:0}}>Turn on notifications in your settings to stay updated on the latest sales! <TouchableOpacity onPress={()=>setShowAlert(false)}><Text style={{textDecorationLine:'underline',color:'black'}}>Dismiss</Text></TouchableOpacity></Text></TouchableOpacity>:null
      }
    </>
  );
};

export default DashboardScreen;
const styles = StyleSheet.create({
  alert:{position:'absolute',marginBottom:40,backgroundColor:'#ff999c',padding:10,alignSelf:'center',bottom:0,borderRadius:10,textAlign:'center'},
  pickerStyle: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    borderRadius: 3,
    height: 38,
    // width: '100%',
    // marginBottom: 8,
    // marginTop: 12,
  },
  inputStyle: {
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  filterBtn: {
    width: '45%',
    paddingVertical: 10,
    backgroundColor: ThemeColor.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelBtn: {
    width: '45%',
    backgroundColor: ThemeColor.redColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  picker: {
    width: '100%',
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColor.gray,
    paddingLeft: 10,
    borderRadius: 3,
  },
  orderStatus: {
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 3,
  },
});
