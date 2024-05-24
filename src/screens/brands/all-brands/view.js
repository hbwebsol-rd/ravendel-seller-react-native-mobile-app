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
import AppLoader from '../../components/loader';
import {GET_BRANDS, DELETE_BRAND} from '../../../queries/brandsQueries';
import {useMutation} from '@apollo/client';
import {useIsFocused} from '@react-navigation/native';
import {Alert, FlatList} from 'react-native';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const AllBrandsView = ({navigation}) => {
  const isFocused = useIsFocused();

  const {loading, error, data, refetch} = useQuery(GET_BRANDS);
  console.log(data, 'brand data');
  const [deleteBrands, {loading: deleteLoading}] = useMutation(DELETE_BRAND, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      GraphqlSuccess('Deleted successfully');
      refetch();
    },
  });

  if (isFocused) {
    refetch();
  }

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    GraphqlError(error);
    return <ErrorText>Something went wrong. Please try again later</ErrorText>;
  }

  const brands = data.brands.data;

  const Item = ({brand, i}) => (
    <>
      <CategoryWrapper key={i}>
        <CategoryName>{brand.name}</CategoryName>
        <CategoryAction>
          <CategoryEditBtn
            onPress={() => {
              navigation.navigate('EditBrand', {singleBrand: brand});
            }}>
            <Icon name="pencil" size={15} color="#000" />
          </CategoryEditBtn>
          <CategoryDeleteAction
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
                    onPress: () => deleteBrands({variables: {id: brand.id}}),
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Icon name="trash" size={15} color={Colors.deleteColor} />
          </CategoryDeleteAction>
        </CategoryAction>
      </CategoryWrapper>
    </>
  );

  const renderItem = ({item, i}) => <Item brand={item} i={i} />;

  return (
    <MainContainer>
      <AllCategoriesWrapper>
        <>
          {deleteLoading ? <AppLoader /> : null}

          {brands.length && (
            <>
              <FlatList
                initialNumToRender={10}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                // refreshControl={
                //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                // }
                data={brands}
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

          {brands.length ? (
            brands
              // .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((brand, i) => (
                <CategoryWrapper key={i}>
                  <CategoryName>{brand.name}</CategoryName>
                  <CategoryAction>
                    <CategoryEditBtn
                      onPress={() => {
                        navigation.navigate('EditBrand', {singleBrand: brand});
                      }}>
                      <Icon name="pencil" size={15} color="#000" />
                    </CategoryEditBtn>
                    <CategoryDeleteAction
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
                                deleteBrands({variables: {id: brand.id}}),
                            },
                          ],
                          {cancelable: false},
                        );
                      }}>
                      <Icon name="trash" size={15} color={Colors.deleteColor} />
                    </CategoryDeleteAction>
                  </CategoryAction>
                </CategoryWrapper>
              ))
          ) : (
            <ErrorText>No Data</ErrorText>
          )}
        </>
      </AllCategoriesWrapper>
    </MainContainer>
  );
};
export default AllBrandsView;
