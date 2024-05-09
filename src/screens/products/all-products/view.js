import React, {useState} from 'react';
import {
  ProductsWrapper,
  ProductsCardWrapper,
  ProductCard,
  ProductTitle,
  ProductPrice,
  ProductCardBody,
  ProductShare,
  ProductHasSellPrice,
  ProductSellPrice,
  ProductPriceWrapper,
  FeatureImageWrapper,
  ProductRemove,
  ProductStatusText,
  ProductStatus,
} from './styles';
import {Image, SearchBar} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FlatList, Share, Text} from 'react-native';
import {GET_PRODUCTS, DELETE_PRODUCT} from '../../../queries/productQueries';
import {isEmpty, BASE_URL} from '../../../utils/helper';
import Colors from '../../../utils/color';
import AppLoader from '../../components/loader';
import {useMutation, useQuery, NetworkStatus} from '@apollo/client';
import {Alert} from 'react-native';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import ThemeColor from '../../../utils/color';

const AllProductsView = ({navigation, RefecthAllProducts, stopReload}) => {
  const {loading, error, data, refetch, networkStatus} = useQuery(
    GET_PRODUCTS,
    {
      notifyOnNetworkStatusChange: true,
    },
  );
  // console.log(loading, error, data, 'popppp');

  const [deleteProduct, {loading: DeleteLoading}] = useMutation(
    DELETE_PRODUCT,
    {
      onError: error => {
        GraphqlError(error);
      },
      onCompleted: data => {
        GraphqlSuccess('Deleted successfully');
        refetch();
      },
    },
  );

  if (error) {
    GraphqlError(error);
    return (
      <Text style={{textAlign: 'center', padding: 10, color: 'red'}}>
        Something went wrong. Please try again later
      </Text>
    );
  }

  if (RefecthAllProducts) {
    stopReload();
    refetch();
  }

  const onShare = async url => {
    try {
      const result = await Share.share({
        message: `https://ravendel-frontend.hbwebsol.com/product/${url}`,
        url: `https://ravendel-frontend.hbwebsol.com/product/${url}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const Item = ({product, i}) => (
    <ProductCard
      key={i}
      onPress={() => {
        navigation.navigate('ProductsScreen', {
          screen: 'EditProduct',
          params: {id: product._id},
        });
      }}>
      <FeatureImageWrapper>
        {!isEmpty(product.feature_image) ? (
          <Image
            source={{
              uri: BASE_URL + '/' + product.feature_image,
            }}
            style={{height: 200}}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{
              uri: 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
            }}
            style={{height: 200}}
            resizeMode="cover"
          />
        )}
      </FeatureImageWrapper>

      <ProductCardBody>
        {product.pricing.sellprice ? (
          <ProductPriceWrapper>
            <ProductSellPrice>
              ${product.pricing.sellprice.toFixed(2)}
            </ProductSellPrice>
            <ProductHasSellPrice>
              ${product.pricing.price.toFixed(2)}
            </ProductHasSellPrice>
          </ProductPriceWrapper>
        ) : (
          <ProductPrice>${product.pricing.price.toFixed(2)}</ProductPrice>
        )}

        <ProductTitle numberOfLines={1}>{product.name}</ProductTitle>
      </ProductCardBody>
      <ProductShare onPress={() => onShare(product.url)}>
        <Icon name="share-alt" color={Colors.primaryColor} size={16} />
      </ProductShare>
      <ProductRemove
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
                  deleteProduct({
                    variables: {id: product.id},
                  }),
              },
            ],
            {cancelable: false},
          );
        }}>
        <Icon name="trash" color={Colors.deleteColor} size={16} />
      </ProductRemove>
      <ProductStatus status={product.status}>
        <ProductStatusText>
          {product.status === null ? 'Draft' : product.status}
        </ProductStatusText>
      </ProductStatus>
    </ProductCard>
  );

  const renderItem = ({item, i}) => <Item product={item} i={i} />;

  // const memoizedValue = useMemo(() => renderItem, [user]);
  return (
    <>
      <SearchBar placeholder="Search Product" lightTheme />
      <MainContainer>
        {DeleteLoading || loading || networkStatus === NetworkStatus.refetch ? (
          <AppLoader />
        ) : data && data.products && data?.products?.data.length > 0 ? (
          <>
            <ProductsWrapper>
              <ProductsCardWrapper>
                <FlatList
                  numColumns={2}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                  // refreshControl={
                  //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  // }
                  data={data.products.data}
                  renderItem={renderItem}
                  columnWrapperStyle={{justifyContent: 'space-around'}}
                  contentContainerStyle={{
                    marginTop: 10,
                    flexDirection: 'column',
                    margin: 'auto',
                    // backgroundColor: ThemeColor.whiteColor,
                  }}
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
              </ProductsCardWrapper>
            </ProductsWrapper>
          </>
        ) : null}
      </MainContainer>
    </>
  );
};

export default AllProductsView;
