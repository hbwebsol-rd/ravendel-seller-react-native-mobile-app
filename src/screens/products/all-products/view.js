import React, {useEffect, useState} from 'react';
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
  AttributesWrapper,
  AttrCard,
  AttrName,
  AttrVal,
  AttrActionWrapper,
  AttrActionBtn,
  AttrValTitle,
  AttrValWrapper,
  AttrHeader,
} from './styles';
import {Image, SearchBar} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  FlatList,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_PRODUCTS, DELETE_PRODUCT} from '../../../queries/productQueries';
import {isEmpty, BASE_URL, formatCurrency, URL} from '../../../utils/helper';
import Colors from '../../../utils/color';
import AppLoader from '../../components/loader';
import {useMutation, useQuery, NetworkStatus} from '@apollo/client';
import {Alert} from 'react-native';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import ThemeColor from '../../../utils/color';
import {Input} from '@rneui/base';
import BottomModal from '../../components/bottom-modal';
import CustomPicker from '../../components/custom-picker';
import {useSelector} from 'react-redux';

const AllProductsView = ({navigation, RefecthAllProducts, stopReload}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [productStatus, setProductStatus] = useState('');
  const {currencyOptions, currencySymbol} = useSelector(
    state => state.dashboard,
  );
  const {loading, error, data, refetch, networkStatus} = useQuery(
    GET_PRODUCTS,
    {
      variables: {admin: true},
      notifyOnNetworkStatusChange: true,
    },
  );
  // const bottomSheetModalRef = useRef(null);

  // // variables
  // const snapPoints = useMemo(() => ['60%'], []); // For Bottomsheet Modal
  // // callbacks
  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  const picker = [
    {label: 'Pushbish', value: 'publish'},
    {label: 'Draft', value: 'draft'},
  ];

  const handleinpiut = e => {
    setInpvalue(e);
  };

  useEffect(() => {
    if (data && data?.products?.data) setAllProducts(data?.products?.data);
  }, [data]);

  const [deleteProduct, {loading: DeleteLoading, errors}] = useMutation(
    DELETE_PRODUCT,
    {
      refetchQueries: [{query: GET_PRODUCTS}],
      onError: error => {
        // Handle error as needed
        console.error('Error deleting Product:', error);
      },
      onCompleted: data => {
        // Handle completion as needed
        // GraphqlSuccess('Deleted successfully');
        console.log('Product deleted successfully:', data);
        refetch();
      },
    },
  );

  const deleteProductFun = id => {
    console.log(id);
    deleteProduct(id);
  };

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
        message: `${BASE_URL}product/${url}`,
        url: `${BASE_URL}product/${url}`,
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

  const handleFilter = val => {
    if (val) {
      setProductStatus(val);
    } else {
      setProductStatus('');
    }
  };

  const applyFilter = () => {
    const filterdata = data?.products?.data?.filter(data => {
      // console.log(data, ' d1');
      const matchesSearch = inpvalue
        ? Object.values(data).some(val => {
            return String(val).toLowerCase().includes(inpvalue.toLowerCase());
          })
        : true;
      const matchesProductStatus =
        !productStatus || data['status'].toLowerCase().includes(productStatus);
      return matchesSearch && matchesProductStatus;
    });
    setAllProducts(filterdata);
    setOpenModal(false);
  };

  useEffect(() => {
    applyFilter();
  }, [inpvalue]);

  const handleClear = () => {
    setProductStatus('');
    setPaymentFillter('');
    setFrom('');
    setTo('');
    setAllOrders(data?.orders?.data);
    bottomSheetModalRef.current?.dismiss();
  };
  const Item = ({product, i}) => (
    <>
      <TouchableOpacity
        style={styles.productContainer}
        onPress={() => navigation.navigate('EditProduct', {id: product._id})}
        key={i}>
        <View style={{width: '30%', marginRight: 20}}>
          {product.feature_image ? (
            <>
              <Image
                source={{uri: URL + product.feature_image}}
                style={{width: '100%', height: 115}}
              />
            </>
          ) : (
            <Image
              source={{
                uri: 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
              }}
              style={{width: '100%', height: 115}}
            />
          )}
        </View>
        <View style={{width: '65%'}}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.productName}>
            {product.name}
          </Text>
          {product.pricing.sellprice < product.pricing.price ? (
            <ProductPriceWrapper>
              <ProductSellPrice>
                {formatCurrency(
                  product.pricing.sellprice.toFixed(2),
                  currencyOptions,
                  currencySymbol,
                )}
              </ProductSellPrice>
              <ProductHasSellPrice>
                {formatCurrency(
                  product.pricing.price.toFixed(2),
                  currencyOptions,
                  currencySymbol,
                )}
              </ProductHasSellPrice>
              {product.pricing.discountPercentage &&
              product.pricing.discountPercentage > 0 ? (
                <ProductSellPrice style={{marginLeft: 8}}>
                  {product.pricing.discountPercentage}% Off
                </ProductSellPrice>
              ) : null}
            </ProductPriceWrapper>
          ) : (
            <ProductPrice>
              {' '}
              {formatCurrency(
                product.pricing.price.toFixed(2),
                currencyOptions,
                currencySymbol,
              )}
            </ProductPrice>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: 0,
              right: 0,
              zIndex: 10,
            }}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                padding: 5,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
              onPress={() => onShare(product.url)}>
              <Icon name="share-alt" color={Colors.primaryColor} size={16} />
            </TouchableOpacity>
            <View
              style={{
                ...styles.status,
                backgroundColor:
                  product.status === 'Publish'
                    ? ThemeColor.green
                    : ThemeColor.redColor,
              }}
              status={product.status}>
              <ProductStatusText>
                {product.status === null ? 'Draft' : product.status}
              </ProductStatusText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  const renderItem = ({item, i}) => <Item product={item} i={i} />;
  return (
    <>
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
          onPress={() => setOpenModal(true)}>
          <Icon name="filter" color="gray" size={30} />
        </TouchableOpacity>
      </View>
      <MainContainer>
        {DeleteLoading || loading || networkStatus === NetworkStatus.refetch ? (
          <AppLoader />
        ) : data && data.products && data?.products?.data.length > 0 ? (
          <>
            <ProductsWrapper>
              <ProductsCardWrapper>
                <FlatList
                  initialNumToRender={10}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                  // refreshControl={
                  //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  // }
                  data={allProducts}
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
              </ProductsCardWrapper>
            </ProductsWrapper>
          </>
        ) : null}
        <BottomModal setModalOpen={setOpenModal} modalOpen={openModal}>
          <Text style={{fontSize: 16}}>Filter</Text>
          <CustomPicker
            iosSelect
            pickerKey="label"
            pickerVal="value"
            androidPickerData={picker}
            iosPickerData={picker}
            selectedValue={productStatus}
            pickerValChange={val => {
              handleFilter(val);
            }}
            placeholder="All"
            label="Product Status"
            getNullval
            onDonePress={() => {}}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => setOpenModal(false)}
              style={styles.cancelBtn}>
              <Text style={{color: '#fff', fontSize: 16}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => applyFilter()}
              style={styles.filterBtn}>
              <Text style={{color: '#fff', fontSize: 16}}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
          {productStatus ? (
            <TouchableOpacity
              onPress={() => handleClear()}
              style={{
                marginTop: 5,
                alignSelf: 'center',
                width: '45%',
                paddingVertical: 10,
                backgroundColor: ThemeColor.grayColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <Text style={{color: '#fff', fontSize: 16}}>Clear Filter</Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </BottomModal>
      </MainContainer>
    </>
  );
};

export default AllProductsView;
const styles = StyleSheet.create({
  status: {
    padding: 0,
    width: 60,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    alignSelf: 'center',
  },
  productContainer: {
    width: '100%',
    marginVertical: '1%',
    padding: 10,
    position: 'relative',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: 0,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  productName: {
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 10,
    fontWeight: 'bold',
    color: `${Colors.primaryColor}`,
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
    backgroundColor: ThemeColor.persianGreen,
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
});
