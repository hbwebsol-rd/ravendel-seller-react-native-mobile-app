import React, {useState} from 'react';
import {Input} from '@rneui/themed';
import {
  AddCouponWrapper,
  FormWrapper,
  CouponExpiryBtn,
  CouponExpiryText,
  CouponExpiryLabel,
  Restricationtitle,
} from './styles';
import BottomDivider from '../../components/bottom-divider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomPicker from '../../components/custom-picker';
import {Text} from 'react-native';
import moment from 'moment';
import {ADD_COUPON} from '../../../queries/couponQueries';
import {GET_CATEGORIES, GET_PRODUCTS} from '../../../queries/productQueries';
import AppLoader from '../../components/loader';
import {Query, useQuery} from '@apollo/client';
import {useMutation} from '@apollo/client';
import FormActionsComponent from '../../components/formAction';
import MulipleSelect from '../../components/multiple-selection';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const discountType = [
  {label: 'Fixed Amount Discount', value: 'amount-discount'},
  {label: 'Fixed Percantage Discount', value: 'precantage-discount'},
];

var stateObj = {
  code: '',
  description: '',
  discount_type: 'amount-discount',
  discount_value: '',
  free_shipping: false,
  expire: new Date(),
  minimum_spend: '0',
  maximum_spend: '0',
  products: [],
  exclude_products: [],
  categories: [],
  exclude_categories: [],
};

const AddCouponsForm = ({navigation}) => {
  const [couponForm, setCouponForm] = useState(stateObj);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS);

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_CATEGORIES);
  console.log(productsData, 'prodcdata');
  const products = productsData?.products?.data;
  const allCategories = categoriesData?.productCategories?.data;

  const [validation, setValdiation] = useState({
    code: '',
    description: '',
    discount_value: '',
  });

  const [addCoupon, {loading: addedLoading}] = useMutation(ADD_COUPON, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      GraphqlSuccess('Added successfully');
      setCouponForm(stateObj);
      navigation.goBack();
    },
  });

  const AddCouponCodeForm = () => {
    if (couponForm.code === '') {
      setValdiation({...validation, code: 'Required'});
    } else if (couponForm.description === '') {
      setValdiation({...validation, code: '', description: 'Required'});
    } else if (couponForm.discount_value === '') {
      setValdiation({
        ...validation,
        code: '',
        description: '',
        discount_value: 'Required',
      });
    } else {
      setValdiation({
        ...validation,
        code: '',
        description: '',
        discount_value: '',
      });
      addCoupon({variables: couponForm});
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    var convertedDate = moment(date).format('YYYY-MM-DD');
    setCouponForm({...couponForm, ['expire']: convertedDate});
    hideDatePicker();
  };
  return (
    <>
      {addedLoading ? <AppLoader /> : null}
      <FormActionsComponent
        onCancel={() => navigation.goBack()}
        onSubmit={AddCouponCodeForm}
        submitText="Add"
      />
      <AddCouponWrapper>
        <FormWrapper>
          <Input
            label="Coupon Code"
            value={couponForm.code}
            onChangeText={value =>
              setCouponForm({...couponForm, ['code']: value})
            }
            errorMessage={validation.code}
          />
          <Input
            label="Description"
            value={couponForm.description}
            onChangeText={value =>
              setCouponForm({...couponForm, ['description']: value})
            }
            multiline
            numberOfLines={2}
            errorMessage={validation.description}
          />
          <Input
            label="Coupon Amount"
            value={couponForm.discount_value}
            onChangeText={value =>
              setCouponForm({...couponForm, ['discount_value']: value})
            }
            keyboardType="numeric"
            errorMessage={validation.discount_value}
          />
          <CouponExpiryBtn onPress={showDatePicker}>
            <CouponExpiryLabel>Coupon Expiry</CouponExpiryLabel>
            <CouponExpiryText>
              {moment(couponForm.expire).format('ll')}
            </CouponExpiryText>
          </CouponExpiryBtn>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <CustomPicker
            iosDropdown
            pickerKey="label"
            pickerVal="value"
            androidPickerData={discountType}
            selectedValue={couponForm.discount_type}
            iosPickerData={discountType}
            pickerValChange={val =>
              setCouponForm({...couponForm, ['discount_type']: val})
            }
            placeholder="Please Select"
            label="Discount Type"
          />
          <Restricationtitle>Usage restriction</Restricationtitle>
          <Input
            keyboardType="numeric"
            label="Minimum Spend"
            value={couponForm.minimum_spend}
            onChangeText={value =>
              setCouponForm({...couponForm, ['minimum_spend']: value})
            }
          />
          <Input
            keyboardType="numeric"
            label="Maximum Spend"
            value={couponForm.maximum_spend}
            onChangeText={value =>
              setCouponForm({...couponForm, ['maximum_spend']: value})
            }
          />
          {products && products.length ? (
            <>
              <MulipleSelect
                items={products}
                selected={couponForm.products}
                onItemChange={items => {
                  setCouponForm({
                    ...couponForm,
                    ['products']: items,
                  });
                }}
                label="Products"
                itemkey="name"
                value="id"
              />
              <MulipleSelect
                items={products}
                selected={couponForm.exclude_products}
                onItemChange={items => {
                  setCouponForm({
                    ...couponForm,
                    ['exclude_products']: items,
                  });
                }}
                label="Exclude Products"
                itemkey="name"
                value="id"
              />
            </>
          ) : null}

          {allCategories && allCategories.length ? (
            <>
              <MulipleSelect
                items={allCategories}
                selected={couponForm.categories}
                onItemChange={items => {
                  setCouponForm({
                    ...couponForm,
                    ['categories']: items,
                  });
                }}
                label="Categories"
                itemkey="name"
                value="id"
              />
              <MulipleSelect
                items={allCategories}
                selected={couponForm.exclude_categories}
                onItemChange={items => {
                  setCouponForm({
                    ...couponForm,
                    ['exclude_categories']: items,
                  });
                }}
                label="Exclude Categories"
                itemkey="name"
                value="id"
              />
            </>
          ) : null}
          {/* <Query query={GET_PRODUCTS}>
            {({loading, error, data}) => {
              if (loading) {
                return <AppLoader />;
              }
              if (error) {
                return <Text>Somethng went wrong</Text>;
              }

              const products = data.products;
              return products.length ? (
                <>
                  <MulipleSelect
                    items={products}
                    selected={couponForm.products}
                    onItemChange={(items) => {
                      setCouponForm({
                        ...couponForm,
                        ['products']: items,
                      });
                    }}
                    label="Products"
                    itemkey="name"
                    value="id"
                  />
                  <MulipleSelect
                    items={products}
                    selected={couponForm.exclude_products}
                    onItemChange={(items) => {
                      setCouponForm({
                        ...couponForm,
                        ['exclude_products']: items,
                      });
                    }}
                    label="Exclude Products"
                    itemkey="name"
                    value="id"
                  />
                </>
              ) : null;
            }}
          </Query>
          <Query query={GET_CATEGORIES}>
            {({loading, error, data}) => {
              if (loading) {
                return <AppLoader />;
              }
              if (error) {
                return <Text>Somethng went wrong</Text>;
              }

              const allCategories = data.productCategories;
              return allCategories.length ? (
                <>
                  <MulipleSelect
                    items={allCategories}
                    selected={couponForm.categories}
                    onItemChange={(items) => {
                      setCouponForm({
                        ...couponForm,
                        ['categories']: items,
                      });
                    }}
                    label="Categories"
                    itemkey="name"
                    value="id"
                  />
                  <MulipleSelect
                    items={allCategories}
                    selected={couponForm.exclude_categories}
                    onItemChange={(items) => {
                      setCouponForm({
                        ...couponForm,
                        ['exclude_categories']: items,
                      });
                    }}
                    label="Exclude Categories"
                    itemkey="name"
                    value="id"
                  />
                </>
              ) : null;
            }}
          </Query> */}
        </FormWrapper>
        <BottomDivider />
      </AddCouponWrapper>
    </>
  );
};

export default AddCouponsForm;
