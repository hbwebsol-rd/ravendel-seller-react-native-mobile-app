import {useMutation, useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
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
import {capitalizeFirstLetter, wait} from '../../utils/helper';
import {Input} from '@rneui/base';

const AllGroupScreen = ({navigation}) => {
  const {loading, error, data, refetch} = useQuery(GET_GROUP_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);
  const [inpvalue, setInpvalue] = useState('');
  const [allGroups, setAllGroups] = useState('');

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

  useEffect(() => {
    refetch();
  }, []);

  const deleteGroupFun = id => {
    console.log(id);
    deleteGroup(id);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleinpiut = e => {
    setInpvalue(e);
  };

  useEffect(() => {
    if (data) {
      setAllGroups(data.groups.data);
    }
  }, [data]);

  useEffect(() => {
    applyFilter();
  }, [inpvalue]);

  const applyFilter = () => {
    const filterdata =
      data &&
      data.groups.data.filter(data => {
        // console.log(data, ' d1');
        const matchesSearch = inpvalue
          ? Object.values(data).some(val => {
              return String(val).toLowerCase().includes(inpvalue.toLowerCase());
            })
          : true;
        return matchesSearch;
      });
    setAllGroups(filterdata);
  };

  const Item = ({grp, i}) => (
    <>
      <View style={styles.groupcard} key={i}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>
            {capitalizeFirstLetter(grp.title)}
          </Text>
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
                      {
                        setInpvalue('')
                        deleteGroupFun({
                          variables: {deleteGroupId: grp.id},
                        })
                      }
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
      {loading && <AppLoader />}
      {error && <Text>Something went wrong. Please try again later</Text>}
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
          placeholder="Search Group"
          leftIcon={() => <Icon name="search" color="gray" size={16} />}
          leftIconContainerStyle={{marginLeft: 15}}
        />
        {/* <TouchableOpacity
            style={styles.filter}
            onPress={() => setOpenModal(true)}>
            <Icon name="filter" color="gray" size={30} />
          </TouchableOpacity> */}
      </View>
      {data && data.groups && (
        <>
          <FlatList
            contentContainerStyle={{marginHorizontal: 10}}
            initialNumToRender={10}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={allGroups}
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
    // padding: 10,
  },
  groupcard: {
    width: '100%',
    // margin: 1% 0,
    padding: 10,
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupName: {
    fontSize: 14,
    letterSpacing: 0.5,
    // marginBottom: 10,
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
    flexDirection: 'row',
  },
  groupValTitle: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 5,
    marginRight: 10,
  },
  inputStyle: {
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default AllGroupScreen;
