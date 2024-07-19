import React, {useEffect, useState} from 'react';
import {
  AllCategoriesWrapper,
  CategoryWrapper,
  CategoryName,
  CategoryAction,
  CategoryEditBtn,
  CategoryDeleteAction,
  ErrorText,
} from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../utils/color';
import {Query, useQuery} from '@apollo/client';
import {useMutation} from '@apollo/client';
import AppLoader from '../../components/loader';
import {GET_CATEGORIES, DELETE_CATEGORY} from '../../../queries/productQueries';
import {useIsFocused} from '@react-navigation/native';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {unflatten, wait} from '../../../utils/helper';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import {Input} from '@rneui/base';

const AllCategoriesView = ({navigation}) => {
  const isFocused = useIsFocused();
  const [inpvalue, setInpvalue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const {loading, error, data, refetch, networkStatus} = useQuery(
    GET_CATEGORIES,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  const [deleteCat, {loading: deleteLoading}] = useMutation(DELETE_CATEGORY, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      GraphqlSuccess('Deleted successfully');
      refetch();
    },
  });

  const handleinpiut = e => {
    setInpvalue(e);
  };

  useEffect(() => {
    applyFilter();
  }, [inpvalue]);

  const applyFilter = () => {
    const filterdata =
      data &&
      data.productCategories.data.filter(data => {
        // console.log(data, ' d1');
        const matchesSearch = inpvalue
          ? Object.values(data).some(val => {
              return String(val).toLowerCase().includes(inpvalue.toLowerCase());
            })
          : true;
        return matchesSearch;
      });
    setAllCategories(filterdata);
  };

  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (data && data.productCategories.data) {
      setAllCategories(data.productCategories.data);
    }
  }, [data]);

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    GraphqlError(error);
    return <ErrorText>Something went wrong. Please try again later</ErrorText>;
  }
  const Item = ({category, i}) => (
    <>
      {category.children && category.children.length > 0 ? (
        <View key={i}>
          <CategoryWrapper>
            <CategoryName
              style={{
                paddingLeft: category.parentId === null ? 0 : 10,
              }}>
              {category.parentId === null ? category.name+'adsda' : `${category.name}asdasd`}
            </CategoryName>
            <CategoryAction>
              <CategoryEditBtn
                onPress={() => {
                  navigation.navigate('EditCategory', {
                    singleCategory: category,
                  });
                }}>
                <Icon name="pencil" size={15} color="#000" />
              </CategoryEditBtn>
              <CategoryDeleteAction
                onPress={() => {
                  Alert.alert(
                    'Ooops',
                    'Currently not deleted because if this category have sub-menus  ',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          // deleteCat({variables: {id: category.id}}),
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <Icon name="trash" size={15} color={Colors.deleteColor} />
              </CategoryDeleteAction>
            </CategoryAction>
          </CategoryWrapper>
          <View
            style={{
              paddingLeft: 12,
              backgroundColor: '#fff',
            }}>
            <FlatList
              initialNumToRender={10}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              data={category.children}
              renderItem={renderItem}
            />
          </View>
        </View>
      ) : (
        <CategoryWrapper key={i}>
          <CategoryName
            style={{
              paddingLeft: category.parentId === null ? 0 : 10,
            }}>
            {category.parentId === null ? category.name : `${category.name}`}
          </CategoryName>
          <CategoryAction>
            <CategoryEditBtn
              onPress={() => {
                navigation.navigate('EditCategory', {singleCategory: category});
              }}>
              <Icon name="pencil" size={15} color="#000" />
            </CategoryEditBtn>
            <CategoryDeleteAction
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to delete this category? ',"",
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        setInpvalue('')
                        deleteCat({variables: {id: category.id}});
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }}>
              <Icon name="trash" size={15} color={Colors.deleteColor} />
            </CategoryDeleteAction>
          </CategoryAction>
        </CategoryWrapper>
      )}
    </>
  );

  const renderItem = ({item, i}) => <Item category={item} i={i} />;

  return (
    <>
      {deleteLoading ? <AppLoader /> : null}
      <View style={{flex:1}}>
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
            placeholder="Search Categories"
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={allCategories}
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
      </View>
    </>
  );
};

export default AllCategoriesView;
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
