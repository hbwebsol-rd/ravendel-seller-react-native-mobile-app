import {useMutation, useQuery} from '@apollo/client';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import AppHeader from '../components/header';
import FabBtn from '../components/fab-btn';
import ThemeColor from '../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppLoader from '../components/loader';
import {
  DELETE_GROUP_PRODUCT,
  GET_GROUP_PRODUCTS,
} from '../../queries/groupProductQueries';

const AllGroupScreen = ({navigation}) => {
  const {loading, error, data, refetch} = useQuery(GET_GROUP_PRODUCTS);

  const [deleteGroup, {loadings, errors}] = useMutation(DELETE_GROUP_PRODUCT, {
    refetchQueries: [{query: GET_GROUP_PRODUCTS}],
    onError: error => {
      // Handle error as needed
      console.error('Error deleting attribute:', error);
    },
    onCompleted: data => {
      // Handle completion as needed
      console.log('Group deleted successfully:', data);
    },
  });

  const deleteGroupFun = id => {
    console.log(id);
    deleteGroup(id);
  };

  const Item = ({grp, i}) => (
    <>
      <View style={styles.groupcard} key={i}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{grp.title}</Text>
          <View style={styles.groupActionWrapper}>
            <TouchableOpacity
              style={styles.groupActionBtn}
              onPress={() => {
                navigation.navigate('AddGroup', {id: grp.id});
              }}>
              <Icon name="pencil" size={15} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.groupActionBtn}
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
                        deleteGroupFun({
                          variables: {deleteGroupId: grp.id},
                        }),
                    },
                  ],
                  {cancelable: false},
                );
              }}>
              <Icon name="trash" size={15} color={ThemeColor.deleteColor} />
            </TouchableOpacity>
          </View>
        </View>

        {grp.productIds && grp.productIds.length ? (
          <View style={styles.groupValWrapper}>
            <Text style={styles.groupValTitle}>Products</Text>
            <Text style={styles.groupValTitle}>{grp.productIds.length}</Text>
          </View>
        ) : null}
      </View>
    </>
  );

  const renderItem = ({item, i}) => <Item grp={item} i={i} />;

  return (
    <View style={styles.container}>
      <AppHeader title="Group Product" navigation={navigation} />
      <ScrollView style={styles.groupWrapper}>
        {loading && <AppLoader />}
        {error && <Text>Something went wrong. Please try again later</Text>}

        {data && data.groups && (
          <>
            <FlatList
              initialNumToRender={10}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              data={data.groups.data}
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
        )}
      </ScrollView>
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddGroup');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupWrapper: {
    padding: 10,
  },
  groupcard: {
    width: '100%',
    // margin: 1% 0,
    padding: 10,
    position: 'relative',
    backgroundColor: '#fff',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupName: {
    fontSize: 18,
    letterSpacing: 0.5,
    marginBottom: 10,
    fontWeight: 'bold',
    color: ThemeColor.primaryColor,
  },
  groupActionWrapper: {
    flexDirection: 'row',
    position: 'relative',
    top: 5,
    right: 5,
  },
  groupActionBtn: {
    padding: '5 10',
    marginLeft: 5,
  },
  groupValWrapper: {
    marginTop: 10,
  },
  groupValTitle: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 5,
  },
});

export default AllGroupScreen;
