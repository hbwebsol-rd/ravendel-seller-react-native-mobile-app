import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {
  OrdersWrapper,
  OrderCard,
  OrderAmount,
  OrderID,
  OrderStatus,
  OrderDate,
  OrderView,
} from './styles';
import CustomPicker from '../../components/custom-picker';
import {GET_ORDER, GET_ORDERS} from '../../../queries/orderQueries';
import {useQuery} from '@apollo/client';
import moment from 'moment';
import ThemeColor from '../../../utils/color';
import {Input} from '@rneui/base';
import {isEmpty, wait} from '../../../utils/helper';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native';
import CustomDatePicker from '../../components/datetimepicker';
import AppLoader from '../../components/loader';
const Orders = [
  {
    order_date: '30 Oct 2020',
    order_id: '#ORD0001',
    order_status: 'Pending',
    type: 1,
    order_amount: '2500',
  },
  {
    order_date: '05 Nov 2020',
    order_id: '#ORD0002',
    order_status: 'Not-confirmed',
    type: 2,
    order_amount: '700',
  },
  {
    order_date: '12 Nov 2020',
    order_id: '#ORD0003',
    order_status: 'Out for delivery',
    type: 3,
    order_amount: '100',
  },
  {
    order_date: '31 Nov 2020',
    order_id: '#ORD0004',
    order_status: 'Process',
    type: 4,
    order_amount: '3500',
  },
];

const picker = [
  {label: 'In Progress', value: 'inprogress'},
  {label: 'Shipped', value: 'shipped'},
  {label: 'Out for delivery', value: 'outfordelivery'},
  {label: 'Delivered', value: 'delivered'},
];

const paymentPicker = [
  {label: 'Pending', value: 'pending'},
  {label: 'Failed', value: 'failed'},
  {label: 'Success', value: 'success'},
  {label: 'Cancelled', value: 'cancelled'},
  {label: 'Processing', value: 'processing'},
];
const AllOrderView = ({navigation}) => {
  const {loading, error, data, refetch} = useQuery(GET_ORDERS, {
    notifyOnNetworkStatusChange: true,
  });
  const [AllOrders, setAllOrders] = useState([]);
  const [shippingstatus, setFillter] = useState('');
  const [paymentstatus, setPaymentFillter] = useState('');
  const [inpvalue, setInpvalue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setFrom] = useState('');
  const [endDate, setTo] = useState('');
  const [appliedFilters, setAppliedFilters] = useState(['', '', '', '']);

  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['60%'], []); // For Bottomsheet Modal
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleinpiut = e => {
    setInpvalue(e);
  };

  const handleDate = (name, val) => {
    if (name === 'From') {
      setFrom(val);
    } else {
      setTo(val);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data && data?.orders?.data) setAllOrders(data?.orders?.data);
  }, [data]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
  const handleFilter = val => {
    if (val) {
      var filterOrder = data?.orders?.data.filter(
        order => order.shippingStatus === val,
      );
      // setAllOrders(filterOrder);
      setFillter(val);
    } else {
      setFillter('');
      // setAllOrders(data?.orders?.data);
    }
  };

  const handlePaymentFilter = val => {
    if (val) {
      var filterOrder = data?.orders?.data.filter(
        order => order.paymentStatus === val,
      );
      // setAllOrders(filterOrder);
      setPaymentFillter(val);
    } else {
      setPaymentFillter('');
      // setAllOrders(data?.orders?.data);
    }
  };

  const applyFilter = () => {
    const filterdata = data?.orders?.data?.filter(data1 => {
      // console.log(data1, ' d1');
      const matchesSearch = inpvalue
        ? Object.values(data1).some(val => {
            return (
              String(val).toLowerCase().includes(inpvalue.toLowerCase()) ||
              String(val?.firstname + ' ' + val?.lastname)
                .toLowerCase()
                .includes(inpvalue.toLowerCase())
            );
          })
        : true;
      // const matchesTabs =
      // MuiTabsvalue === 'All' || data1[statusTabdata1.name] === MuiTabsvalue;
      const matchesPaymentStatus =
        !paymentstatus ||
        data1['paymentStatus'].toLowerCase().includes(paymentstatus);
      const matchesShippingStatus =
        !shippingstatus ||
        data1['shippingStatus'].toLowerCase().includes(shippingstatus);
      const currentDate = new Date(data1['date']);
      currentDate.setHours(0, 0, 0, 0); // Reset time endDate midnight
      const startDateWithoutTime = startDate ? new Date(startDate) : null;
      const endDateWithoutTime = endDate ? new Date(endDate) : null;
      if (startDateWithoutTime) startDateWithoutTime.setHours(0, 0, 0, 0);
      if (endDateWithoutTime) endDateWithoutTime.setHours(0, 0, 0, 0);
      const matchesDateRange =
        (!startDateWithoutTime || currentDate >= startDateWithoutTime) &&
        (!endDateWithoutTime || currentDate <= endDateWithoutTime);

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesShippingStatus &&
        matchesDateRange
      );
    });

    const shipping = !isEmpty(shippingstatus) ? true : '';
    const payment = !isEmpty(paymentstatus) ? true : '';
    const startD = startDate ? true : '';
    const endD = endDate ? true : '';
    setAppliedFilters([shipping, payment, startD, endD]);
    setAllOrders(filterdata);
    bottomSheetModalRef.current?.dismiss();
  };

  useEffect(() => {
    applyFilter();
  }, [inpvalue]);

  const handleClear = () => {
    setFillter('');
    setPaymentFillter('');
    setFrom('');
    setTo('');
    setAllOrders(data?.orders?.data);
    bottomSheetModalRef.current?.dismiss();
  };

  const Item = ({order, i}) => (
    <>
      <OrderCard
        onPress={() => {
          navigation.navigate('ViewOrder', {id: order.id});
        }}
        style={{backgroundColor: ThemeColor.whiteColor}}
        key={i}>
        <OrderDate>{moment(order.date).format('MMMM D, YYYY H:m')}</OrderDate>
        <OrderID>
          {/* <Text style={{fontWeight: 'bold'}}>Order Id:</Text>{' '} */}
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
    <BottomSheetModalProvider>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Input
          containerStyle={{
            height: 70,
            width: '85%',
          }}
          inputContainerStyle={styles.inputStyle}
          label=""
          value={inpvalue}
          onChangeText={handleinpiut}
          placeholder="Search Here"
          leftIcon={() => <Icon name="search" color="gray" size={16} />}
          leftIconContainerStyle={{marginLeft: 15}}
        />
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => handlePresentModalPress()}>
          <Icon name="filter" color="gray" size={30} />
        </TouchableOpacity>
      </View>
      <OrdersWrapper>
        <FlatList
          initialNumToRender={10}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={AllOrders}
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
        <BottomSheetModal
          // enableDismissOnClose={false}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          style={{flex: 1, elevation: 10, paddingHorizontal: 15}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: ThemeColor.blackColor}}>
                Filter
              </Text>
              {!isEmpty(shippingstatus) ||
              !isEmpty(paymentstatus) ||
              startDate ||
              endDate ? (
                <TouchableOpacity onPress={() => handleClear()}>
                  <Text style={{color: ThemeColor.primaryColor, fontSize: 14}}>
                    Clear Filter
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <CustomPicker
              iosSelect
              pickerKey="label"
              pickerVal="value"
              androidPickerData={picker}
              iosPickerData={picker}
              selectedValue={shippingstatus}
              pickerValChange={val => {
                handleFilter(val);
              }}
              placeholder="All"
              label="Shipping Status"
              getNullval
              onDonePress={() => {}}
            />
            <CustomPicker
              iosSelect
              pickerKey="label"
              pickerVal="value"
              androidPickerData={paymentPicker}
              iosPickerData={paymentPicker}
              selectedValue={paymentstatus}
              pickerValChange={val => {
                handlePaymentFilter(val);
              }}
              placeholder="All"
              label="Payment Status"
              getNullval
              onDonePress={() => {}}
            />
            <Text
              style={{fontSize: 16, fontWeight: 'bold'}}
              fontSize={18}
              color={ThemeColor.gray}>
              From
            </Text>
            <View style={styles.picker}>
              <CustomDatePicker
                // heading="From"
                fieldname={'From'}
                mode={'date'}
                answer={startDate}
                placeholder={'Select Date'}
                pickerStyle={styles.pickerStyle}
                onChange={handleDate}
                vc={'#000'}
                phc={'lightgray'}
              />
            </View>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', marginTop: 15}}
              color={ThemeColor.gray}>
              To
            </Text>
            <View style={styles.picker}>
              <CustomDatePicker
                // heading="To"+
                fieldname={'To'}
                mode={'date'}
                answer={endDate}
                placeholder={'Select Date'}
                pickerStyle={styles.pickerStyle}
                onChange={handleDate}
                vc={'#000'}
                phc={'lightgray'}
                mindate={startDate}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  appliedFilters[0] ? null : setFillter('');
                  appliedFilters[1] ? null : setPaymentFillter('');
                  appliedFilters[2] ? null : setFrom('');
                  appliedFilters[3] ? null : setTo('');
                  bottomSheetModalRef.current?.dismiss();
                }}
                style={styles.cancelBtn}>
                <Text style={{color: '#fff', fontSize: 16}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => applyFilter()}
                style={styles.filterBtn}>
                <Text style={{color: '#fff', fontSize: 16}}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BottomSheetModal>
      </OrdersWrapper>
    </BottomSheetModalProvider>
  );
};

export default AllOrderView;
const styles = StyleSheet.create({
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
