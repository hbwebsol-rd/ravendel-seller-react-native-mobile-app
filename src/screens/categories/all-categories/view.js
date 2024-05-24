import React from 'react';
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
import {Alert, FlatList, ScrollView, View} from 'react-native';
import {unflatten} from '../../../utils/helper';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const AllCategoriesView = ({navigation}) => {
  const isFocused = useIsFocused();
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

  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    GraphqlError(error);
    return <ErrorText>Something went wrong. Please try again later</ErrorText>;
  }
  console.log(JSON.stringify(data.productCategories.data));
  var allcategories = unflatten(data.productCategories.data);

  const Item = ({category, i}) => (
    <>
      {category.children && category.children.length > 0 ? (
        <View key={i}>
          <CategoryWrapper>
            <CategoryName
              style={{
                paddingLeft: category.parentId === null ? 0 : 10,
              }}>
              {category.parentId === null
                ? category.name
                : `-- ${category.name}`}
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
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              data={category.children}
              renderItem={renderItem}
              // ListEmptyComponent={() => (
              //   <View>
              //     <Text
              //       style={{
              //         fontSize: 16,
              //         alignSelf: 'center',
              //         color: 'grey',
              //       }}>
              //       No Records Found
              //     </Text>
              //   </View>
              // )}
            />
            {/* {categoriesListing(category.children)} */}
          </View>
        </View>
      ) : (
        <CategoryWrapper key={i}>
          <CategoryName
            style={{
              paddingLeft: category.parentId === null ? 0 : 10,
            }}>
            {category.parentId === null ? category.name : `-- ${category.name}`}
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
                        // deleteCat({variables: {id: category.id}});
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          initialNumToRender={10}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          data={allcategories}
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
        {/* {categoriesListing(allcategories)} */}
      </ScrollView>
    </>
  );
};

export default AllCategoriesView;
