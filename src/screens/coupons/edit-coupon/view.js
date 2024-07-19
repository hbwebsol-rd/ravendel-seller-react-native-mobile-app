import React, {useState, useEffect} from 'react';
import {Input} from '@rneui/themed';
import {
  EditCouponWrapper,
  FormWrapper,
  CouponExpiryBtn,
  CouponExpiryText,
  CouponExpiryLabel,
  Restricationtitle,
} from './styles';
import BottomDivider from '../../components/bottom-divider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomPicker from '../../components/custom-picker';
import {getCheckedIds, isEmpty} from '../../../utils/helper';
import {Text, Alert} from 'react-native';
import moment from 'moment';
import {UPDATE_COUPON} from '../../../queries/couponQueries';
import {GET_CATEGORIES, GET_PRODUCTS} from '../../../queries/productQueries';
import AppLoader from '../../components/loader';
import {Query, useQuery} from '@apollo/client';
import {useMutation} from '@apollo/client';
import FormActionsComponent from '../../components/formAction';
import MulipleSelect from '../../components/multiple-selection';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import EditCategoriesComponent from '../../components/edit-category';
import {ALERT_ERROR, ALERT_SUCCESS} from '../../../store/reducer/alert';
import {useDispatch} from 'react-redux';

const discountType = [
  {label: 'Fixed Amount Discount', value: 'amount-discount'},
  {label: 'Fixed Percentage Discount', value: 'precantage-discount'},
];

const EditCouponsForm = ({navigation, singleCouponDetail}) => {
  const dispatch = useDispatch();
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
  const products = productsData?.products?.data;
  const allCategories = categoriesData?.productCategories?.data;

  const [updateCoupon, {loading: updateLoading}] = useMutation(UPDATE_COUPON, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      if (data.updateCoupon.success) {
        // console.log(data);
        dispatch({type: ALERT_SUCCESS, payload: data.updateCoupon.message});
        navigation.goBack();
      } else {
        dispatch({type: ALERT_ERROR, payload: data.updateCoupon.message});
      }
    },
  });
  const [couponForm, setCouponForm] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [validation, setValdiation] = useState({
    code: '',
    description: '',
    discountValue: '',
  });

  const filterTreeData = data => {
    return data?.reduce((acc, category) => {
      const filteredCategory = {
        id: category?.id,
        name: category.name,
        checked: category.checked,
        url: category.url,
      };
      if (category?.children && category?.children?.length > 0) {
        filteredCategory.children = category?.children;
      }

      if (category?.checked) {
        acc.push(filteredCategory);
      } else if (category?.children && category?.children?.length > 0) {
        filteredCategory.children = filterTreeData(category?.children);
        if (filteredCategory.children.length > 0) {
          acc.push(filteredCategory);
        }
      }

      return acc;
    }, []);
  };
  useEffect(() => {
    if (singleCouponDetail) {
      console.log(singleCouponDetail, ' coupon details');
      const {
        category,
        code,
        date,
        description,
        discountType,
        discountValue,
        excludeCategories,
        excludeProducts,
        expire,
        freeShipping,
        id,
        includeCategories,
        includeProducts,
        maximumSpend,
        minimumSpend,
        product,
        updated,
        categoryTree,
      } = singleCouponDetail;
      const newCoupon = {
        __typename: 'Coupon',
        category: true,
        code: code,
        date: date,
        description: description,
        discountType: discountType,
        discountValue: discountValue && discountValue.toString(),
        // excludeCategories: [],
        // excludeProducts: [],
        expire: expire,
        freeShipping: freeShipping,
        id: id,
        includeCategories: includeCategories,
        // includeProducts: [],
        maximumSpend: maximumSpend && maximumSpend.toString(),
        minimumSpend: minimumSpend && minimumSpend.toString(),
        product: null,
        updated: updated,
        categoryTree: categoryTree,
      };
      setCouponForm(newCoupon);
    }
  }, [singleCouponDetail]);
  console.log(couponForm, ' cpf');
  const UpdateCouponCodeForm = () => {
    if (couponForm.code === '') {
      setValdiation({...validation, code: 'Code is required'});
    } else if (couponForm.description === '') {
      setValdiation({
        ...validation,
        code: '',
        description: 'description is required',
      });
    } else if (couponForm.discountValue === '' || couponForm.discountValue == 0) {
      setValdiation({
        ...validation,
        code: '',
        description: '',
        discountValue: 'Discount value is required',
      });
    } else {
      setValdiation({
        ...validation,
        code: '',
        description: '',
        discountValue: '',
      });

      const filteredData = filterTreeData(couponForm.categoryTree);

      console.log(couponForm, ' popo');
      var updateObejct = {
        id: couponForm.id,
        code: couponForm.code,
        description: couponForm.description,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        freeShipping: couponForm.freeShipping,
        expire: couponForm.expire,
        minimumSpend: Number(couponForm.minimumSpend),
        maximumSpend: Number(couponForm.maximumSpend),
        // products: couponForm.products,
        // exclude_products: couponForm.exclude_products,
        // categories: couponForm.categories,
        category: true,
        includeCategories: couponForm.categoryId,
        categoryTree: filteredData,
        // exclude_categories: couponForm.exclude_categories,
      };
      updateCoupon({variables: updateObejct});
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
      {updateLoading ? <AppLoader /> : null}
      {!isEmpty(couponForm) ? (
        <>
          <FormActionsComponent
            onCancel={() => navigation.goBack()}
            onSubmit={UpdateCouponCodeForm}
            submitText="Save"
          />
          <EditCouponWrapper>
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
                value={couponForm.discountValue}
                onChangeText={value =>
                  setCouponForm({...couponForm, ['discountValue']: value})
                }
                keyboardType="numeric"
                errorMessage={validation.discountValue}
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
                minimumDate={new Date()}
              />
              <CustomPicker
                iosDropdown
                pickerKey="label"
                pickerVal="value"
                androidPickerData={discountType}
                selectedValue={couponForm.discountType}
                iosPickerData={discountType}
                pickerValChange={val =>
                  setCouponForm({...couponForm, ['discountType']: val})
                }
                placeholder="Please Select"
                label="Discount Type"
              />

              <Restricationtitle>Usage restriction</Restricationtitle>
              <Input
                keyboardType="numeric"
                label="Minimum Spend"
                value={couponForm.minimumSpend}
                onChangeText={value =>
                  setCouponForm({...couponForm, ['minimumSpend']: value})
                }
              />
              <Input
                keyboardType="numeric"
                label="Discount upto"
                value={couponForm.maximumSpend}
                onChangeText={value =>
                  setCouponForm({...couponForm, ['maximumSpend']: value})
                }
              />
              <EditCategoriesComponent
                data={allCategories}
                selectedCategoriesTree={couponForm.categoryTree}
                selectedCategories={couponForm.categories}
                onCategoryChange={items => {
                  if (items && items?.length > 0) {
                    const checkedIds = getCheckedIds(items);

                    setCouponForm({
                      ...couponForm,
                      categoryId: checkedIds,
                      categoryTree: items,
                    });
                  } else {
                    setCouponForm({
                      ...couponForm,
                      categoryId: [],
                      categoryTree: [],
                    });
                  }
                }}
              />
              {/* {products && products.length ? (
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
              ) : null} */}

              {/* {allCategories && allCategories.length ? (
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
              ) : null} */}
            </FormWrapper>
          </EditCouponWrapper>
        </>
      ) : null}

      <BottomDivider />
    </>
  );
};

export default EditCouponsForm;
