import React from 'react';
import {ListItem} from '@rneui/themed';
import {AllCustomerWrapper} from './styles';
import {useIsFocused} from '@react-navigation/native';
import AppLoader from '../../components/loader';
import {FlatList, Text} from 'react-native';
import {Query, useQuery} from '@apollo/client';
import {GET_CUSTOMERS} from '../../../queries/customerQueries';
import Colors from '../../../utils/color';
import MainContainer from '../../components/mainContainer';
import {GraphqlError} from '../../components/garphqlMessages';

const AllCustomerView = ({navigation}) => {
  const isFocused = useIsFocused();

  const {loading, error, data, refetch} = useQuery(GET_CUSTOMERS);
  console.log(error, 'a');
  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (loading) {
    return <AppLoader />; // Replace with your loading component
  }

  if (error) {
    GraphqlError(error);
    return <Text>Something went wrong. Please try again later</Text>;
  }

  const customers = data.customers.data;

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
            {customer.firstName + ' ' + customer.lastName}
          </ListItem.Title>
          <ListItem.Subtitle>{customer.phone}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron size={22} color={Colors.primaryColor} />
      </ListItem>
    </>
  );

  const renderItem = ({item, i}) => <Item customer={item} i={i} />;

  return customers.length > 0 ? (
    <>
      <FlatList
        initialNumToRender={10}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        data={customers}
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
