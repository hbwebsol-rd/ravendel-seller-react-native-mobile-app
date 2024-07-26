import React, {useEffect, useState} from 'react';
import {ListItem} from '@rneui/themed';
import {AllCustomerWrapper} from './styles';
import {useIsFocused} from '@react-navigation/native';
import AppLoader from '../../components/loader';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Query, useQuery} from '@apollo/client';
import {GET_CUSTOMERS} from '../../../queries/customerQueries';
import Colors from '../../../utils/color';
import MainContainer from '../../components/mainContainer';
import {GraphqlError} from '../../components/garphqlMessages';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from '@rneui/base';
import {capitalizeFirstLetter} from '../../../utils/helper';

const AllCustomerView = ({navigation}) => {
  const isFocused = useIsFocused();
  const [allCustomers, setAllCustomers] = useState([]);
  const [inpvalue, setInpvalue] = useState('');

  const {loading, error, data, refetch} = useQuery(GET_CUSTOMERS);
  console.log(error, 'a');
  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const handleinpiut = e => {
    setInpvalue(e);
  };

  useEffect(() => {
    applyFilter();
  }, [inpvalue]);

  const applyFilter = () => {
    const filterdata =
      data &&
      data.customers.data.filter(data => {
        // console.log(data, ' d1');
        const matchesSearch = inpvalue
          ? Object.values(data).some(val => {
              return String(val).toLowerCase().includes(inpvalue.toLowerCase());
            })
          : true;
        return matchesSearch;
      });
    setAllCustomers(filterdata);
  };

  useEffect(() => {
    if (data && data.customers.data) {
      setAllCustomers(data.customers.data);
    }
  }, [data]);

  if (loading) {
    return <AppLoader />; // Replace with your loading component
  }

  if (error) {
    GraphqlError(error);
    return <Text>Something went wrong. Please try again later</Text>;
  }

  // const customers = data.customers.data;

  const Item = ({customer, i}) => (
    <>
      <ListItem
        key={i}
        bottomDivider
        onPress={() =>
          navigation.navigate('ViewCustomer', {singleCustomer: customer})
        }>
        <ListItem.Content>
          <ListItem.Title>
            {capitalizeFirstLetter(customer.firstName) +
              ' ' +
              customer.lastName}
          </ListItem.Title>
          <ListItem.Subtitle>{customer.phone}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron size={22} color={Colors.primaryColor} />
      </ListItem>
    </>
  );

  const renderItem = ({item, i}) => <Item customer={item} i={i} />;

  return true > 0 ? (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Input
          containerStyle={{
            height: 70,
            width: '100%',
          }}
          inputContainerStyle={styles.inputStyle}
          label=""
          value={inpvalue}
          onChangeText={handleinpiut}
          placeholder="Search Customers"
          leftIcon={() => <Icon name="search" color="gray" size={16} />}
          leftIconContainerStyle={{marginLeft: 15}}
        />
        {/* <TouchableOpacity
            style={styles.filter}
            onPress={() => setOpenModal(true)}>
            <Icon name="filter" color="gray" size={30} />
          </TouchableOpacity> */}
      </View>
      <FlatList
        initialNumToRender={10}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        data={allCustomers}
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
  ) : null;
};

export default AllCustomerView;
const styles = StyleSheet.create({
  filter: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});
