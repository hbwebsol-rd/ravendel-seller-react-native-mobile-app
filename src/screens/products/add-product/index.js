import React, {useState, useEffect} from 'react';
import AppHeader from '../../components/header';
import AddProductView from './view';
import {Alert, Text, View} from 'react-native';
import {
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_PRODUCTS,
  GET_URL,
} from '../../../queries/productQueries';
import {GET_BRANDS} from '../../../queries/brandsQueries';
import {GET_ATTRIBUTES} from '../../../queries/attributesQueries';
import {GET_TAX} from '../../../queries/taxQueries';
import {GET_SHIPPING} from '../../../queries/shippingQueries';
import AppLoader from '../../components/loader';
import {empty, useMutation, useQuery} from '@apollo/client';
import {
  unflatten,
  isEmpty,
  getUpdatedUrl,
  containsOnlyNumbers,
  convertData,
  BASE_URL,
} from '../../../utils/helper';
import {ADD_PRODUCT} from '../../../queries/productQueries';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import AwesomeAlert from 'react-native-awesome-alerts';
import {mutation, query} from '../../../utils/service';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {ALERT_ERROR, ALERT_SUCCESS} from '../../../store/reducer/alert';
import Multiselect from '../../components/multiselect';
import ThemeColor from '../../../utils/color';
import {ColorSpace} from 'react-native-reanimated';

var addObject = {
  name: 'Test',
  description: 'test',
  url: '',
  categoryId: [],
  categoryTree: [],
  brand: null,
  pricing: {
    price: 10,
    sellprice: 8,
    discountPercentage: 0,
  },
  status: 'Draft',
  meta: {
    title: 'Test Meta Title',
    description: 'Test Meta Description',
    keywords: 'Test Meta Keywords',
  },
  shipping: {
    height: '0',
    width: '0',
    depth: '0',
    weight: '0',
    shippingClass: '',
  },
  tax_class: '',
  feature_product: true,
  product_type: {
    virtual: true,
    downloadable: true,
  },
  quantity: '100',
  sku: 'TEST001',
  feautred_image: '',
  gallery_image: [],
  attribute: [],
  variant: [],
  short_description: '',
  custom_field: [],
};

const AddProductsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [addProduct, {loading: AddLoading}] = useMutation(ADD_PRODUCT, {
    onError: error => {
      console.log(error, ' eerrr');
      // GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data, ' after add');
      // GraphqlSuccess('Added successfully');
      if (data.addProduct.success) {
        setAddProductDetail(addObject);
        navigation.navigate('AllProduct');
        dispatch({type: ALERT_SUCCESS, payload: data.addProduct.message});
      } else {
        dispatch({type: ALERT_ERROR, payload: data.addProduct.message});
      }
    },
  });
  const Categories = useQuery(GET_CATEGORIES);
  const Brands = useQuery(GET_BRANDS);
  const AttributesData = useQuery(GET_ATTRIBUTES);
  const Taxes = useQuery(GET_TAX);
  const Shippings = useQuery(GET_SHIPPING);
  const productData = useQuery(GET_PRODUCTS, {variables: {admin: true}});

  const [loader, setLoader] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState('');
  const [allBrands, setAllBrands] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [allTaxes, setAllTaxes] = useState({});
  const [allShipppings, setAllShippings] = useState({});
  const [featuredImage, setFeaturedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [addProductDetail, setAddProductDetail] = useState({
    name: '',
    description: '',
    url: '',
    categoryId: [],
    categoryTree: [],
    brand: null,
    pricing: {
      price: 0,
      sellprice: 0,
    },
    status: 'Draft',
    meta: {
      title: '',
      description: '',
      keywords: '',
    },
    shipping: {
      height: '0',
      width: '0',
      depth: '0',
      weight: '0',
      shippingClass: '',
    },
    tax_class: '',
    feature_product: false,
    product_type: {
      virtual: false,
      downloadable: false,
    },
    quantity: '',
    sku: '',
    feautred_image: '',
    gallery_image: [],
    attribute: [],
    variant: [],
    short_description: '',
    custom_field: [],
  });

  const [groups, setGroups] = useState([
    {name: '', attributes: [{key: '', value: '', keyId: '', valueId: ''}]},
  ]);
  useEffect(() => {
    if (Categories.data && Categories.data.productCategories) {
      var selectedCat = JSON.parse(
        JSON.stringify(Categories.data.productCategories.data),
      );
      if (selectedCat && selectedCat.length) {
        setAllCategories(selectedCat);
      }
    }
  }, [Categories.data]);

  useEffect(() => {
    if (productData.data && productData.data.products) {
      var selectedPro = productData.data.products.data;
      if (selectedPro && selectedPro.length) {
        setAllProducts(selectedPro);
      }
    }
  }, [productData.data]);

  useEffect(() => {
    if (Brands.data && Brands.data.brands) {
      setAllBrands(Brands.data.brands);
    }
  }, [Brands.data]);

  useEffect(() => {
    if (AttributesData.data && AttributesData.data.productAttributes.data) {
      setAllAttributes(AttributesData.data.productAttributes.data);
    }
  }, [AttributesData.data]);

  useEffect(() => {
    if (Taxes.data && Taxes.data.tax) {
      setAllTaxes(Taxes.data.tax);
    }
  }, [Taxes.data]);

  useEffect(() => {
    if (Shippings.data && Shippings.data.shipping) {
      setAllShippings(Shippings.data.shipping);
    }
  }, [Shippings.data]);

  useEffect(() => {
    if (!isEmpty(allShipppings) && !isEmpty(allTaxes)) {
      if (
        allShipppings.data.shippingClass.length &&
        allTaxes.data.taxClass.length
      ) {
        setAddProductDetail({
          ...addProductDetail,
          shipping: {
            ...addProductDetail.shipping,
            shippingClass: allShipppings.data.global.is_global
              ? allShipppings.data.global.shippingClass
              : '',
          },
          tax_class: allTaxes.data.global.is_global
            ? allTaxes.data.global.taxClass
            : '',
        });
      }
    }
  }, [allTaxes, allShipppings]);

  const onBlurNameInput = value => {
    if (addProductDetail.url === '' && addProductDetail.name !== '') {
      isUrlExist(value);
    }
    if (addProductDetail.meta.title === '') {
      addProductDetail.meta.title = value;
      setAddProductDetail({...addProductDetail});
    }
  };

  const onValueChange = (name, value) => {
    setAddProductDetail({...addProductDetail, [name]: value});
  };

  const onNestedObjectValueChange = (object, name, value) => {
    addProductDetail[object][name] = value;
    setAddProductDetail({...addProductDetail});
  };

  const removeFeaturedImage = () => {
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
          onPress: () => {
            setFeaturedImage('');
            setAddProductDetail({...addProductDetail, feautred_image: ''});
          },
        },
      ],
      {cancelable: false},
    );
  };

  const removeGalleryImage = img => {
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
          onPress: () => {
            var gi = galleryImages.filter(gallery_img => gallery_img !== img);
            setGalleryImages(gi);
            var filterGalleryImages = addProductDetail.gallery_image.filter(
              gallery_img => gallery_img.uri !== img,
            );
            addProductDetail.gallery_image = filterGalleryImages;
            setAddProductDetail({...addProductDetail});
          },
        },
      ],
      {cancelable: false},
    );
  };

  const featureImageAdd = img => {
    setFeaturedImage(img.uri);
    setAddProductDetail({...addProductDetail, ['feautred_image']: img});
  };

  const galleryImageAdd = img => {
    addProductDetail.gallery_image.push(img);
    setAddProductDetail({...addProductDetail});

    galleryImages.push(img.uri);
    setGalleryImages([...galleryImages]);
  };

  const isUrlExist = async url => {
    setLoader(true);
    let updatedUrl = await mutation(GET_URL, {url: url});
    setAddProductDetail({
      ...addProductDetail,
      url: updatedUrl.data.validateUrl.url,
    });
    setLoader(false);
  };

  const onAttrAndVariant = (variantItem, attributeItem) => {
    addProductDetail.variant = variantItem;
    addProductDetail.attribute = attributeItem;
    setAddProductDetail({...addProductDetail});
  };

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
  const addProductSubmit = () => {
    const {
      name,
      url,
      brand,
      short_description,
      description,
      sku,
      quantity,
      pricing,
      status,
      feature_product,
      product_type,
      shipping,
      tax_class,
      meta,
      custom_field,
      attribute,
      variant,
      combinations,
      gallery_image,
      feautred_image,
      categoryId,
    } = addProductDetail;
    // var CategoryIDs = addProductDetail.categoryId.map(cat => cat.id);
    // console.log(JSON.stringify(groups), 'grps');

    const result = [];
    emptyGroup = false;
    console.log(JSON.stringify(groups), ' grr');
    groups.forEach((group, index) => {
      if (
        isEmpty(group.name) ||
        isEmpty(group.attributes[index].keyId) ||
        isEmpty(group.attributes[index].valueId)
      ) {
        emptyGroup = true;
        return;
      }
      group.attributes.forEach(attribute => {
        result.push({
          attributeId: attribute.keyId,
          key: attribute.key,
          attributeValueId: attribute.valueId,
          value: attribute.value,
          group: group.name,
        });
      });
    });

    // console.log(JSON.stringify(result), ' result of data');

    if (isEmpty(name)) {
      dispatch({type: ALERT_ERROR, payload: 'Name is Required'});
      return;
    } else if (isEmpty(description)) {
      dispatch({type: ALERT_ERROR, payload: 'Description is Required'});
      return;
    } else if (isEmpty(short_description)) {
      dispatch({type: ALERT_ERROR, payload: 'Short description is Required'});
      return;
    } else if (
      isEmpty(pricing.price) ||
      !containsOnlyNumbers(pricing.price) ||
      pricing.price === 0
    ) {
      dispatch({type: ALERT_ERROR, payload: 'Price is Required'});
      return;
    } else if (
      isEmpty(pricing.sellprice) ||
      !containsOnlyNumbers(pricing.sellprice) ||
      pricing.price === 0
    ) {
      dispatch({type: ALERT_ERROR, payload: 'Sellprice is Required'});
      return;
    } else if (isEmpty(categoryId)) {
      dispatch({type: ALERT_ERROR, payload: 'Category is Required'});
      return;
    } else if (emptyGroup) {
      dispatch({type: ALERT_ERROR, payload: 'Specification is not selected'});
      return;
    } else if (isEmpty(sku)) {
      dispatch({type: ALERT_ERROR, payload: 'SKU is Required'});
      return;
    } else if (isEmpty(quantity)) {
      dispatch({type: ALERT_ERROR, payload: 'Quantity is Required'});
      return;
    } else if (isEmpty(shipping.shippingClass)) {
      dispatch({type: ALERT_ERROR, payload: 'Shipping Class is Required'});
      return;
    }

    const filteredData = filterTreeData(addProductDetail.categoryTree);

    var details = {
      name: name,
      url: url,
      categoryId: categoryId,
      brand: brand,
      short_description: short_description,
      description: description,
      sku: sku,
      quantity: quantity,
      pricing: pricing,
      status: status,
      featured_product: feature_product,
      product_type: product_type,
      shipping: shipping,
      taxClass: tax_class,
      meta: meta,
      custom_field: custom_field,
      attribute: attribute,
      variant: variant,
      combinations: combinations,
      specifications: result,
      categoryTree: filteredData,
    };
    if (feautred_image?.file) {
      details.feature_image = [feautred_image];
    }
    if (!isEmpty(gallery_image)) {
      details.gallery_image = gallery_image;
    }
    console.log('Product Payload', details);
    // return;
    addProduct({variables: details});
  };

  const removeItemFromGroup = index => {
    console.log('hiii');
    const newArray = groups.filter((_, i) => i !== index);
    setGroups(newArray);
  };

  const removeValueAtIndex = (dataIndex, valueIndex) => {
    setGroups(prevData =>
      prevData.map((item, index) =>
        index === dataIndex
          ? {
              ...item,
              attributes: item.attributes.filter((_, i) => i !== valueIndex),
            }
          : item,
      ),
    );
  };
  // console.log(addProductDetail, groups, ' adp');

  return (
    <>
      {AddLoading || loader ? <AppLoader /> : null}
      <AppHeader title="Add Product" navigation={navigation} back />
      <Text
        style={{
          fontSize: 15,
          marginLeft: 8,
          fontWeight: '600',
          color: ThemeColor.blackColor,
        }}>
        Clone Product
      </Text>
      {/* <View style={{marginHorizontal: 10, marginBottom: 10}}> */}
      <Multiselect
        inititalselect={product}
        hmt={15}
        heading={''}
        height={45}
        fieldname={'attribute'}
        marginTop={10}
        ibw={1}
        inputBgColor={ThemeColor.whiteColor}
        // placeholderFont={FontStyle.fontRegular}
        data={allProducts ?? []}
        onchange={async (name, singleProductid) => {
          if (singleProductid) {
            const response = await query(GET_PRODUCT, {id: singleProductid});
            const singleProduct = response.data.product.data;

            // const singleProduct0 = allProducts.filter(
            //   item => item._id === singleProductid,
            // )[0];
            const cvdata = singleProduct.specifications
              ? convertData(singleProduct.specifications)
              : [];
            console.log(singleProduct.gallery_image, []);
            const newData = {
              _id: singleProduct._id,
              name: singleProduct.name,
              description: singleProduct.description,
              url: singleProduct.url,
              categoryId: singleProduct.categoryId?.map(cat => cat.id),
              categoryTree: singleProduct?.categoryTree || [],
              brand: singleProduct.brand.id,
              pricing: {
                price: singleProduct.pricing.price,
                sellprice: singleProduct.pricing.sellprice,
              },
              status: singleProduct.status,
              meta: {
                description: singleProduct?.meta?.description,
                keywords: singleProduct?.meta?.keywords,
                title: singleProduct?.meta?.title,
              },
              shipping: {
                depth: singleProduct.shipping.depth.toString(),
                height: singleProduct.shipping.height.toString(),
                shippingClass: singleProduct.shipping.shippingClass,
                weight: singleProduct.shipping.weight.toString(),
                width: singleProduct.shipping.width.toString(),
              },
              tax_class: singleProduct.taxClass,
              feature_product: singleProduct.feature_product,
              product_type: singleProduct.product_type,
              quantity: singleProduct.quantity,
              sku: singleProduct.sku,
              feautred_image: singleProduct.feature_image,
              gallery_image: isEmpty(singleProduct.gallery_image)
                ? []
                : singleProduct.gallery_image,
              attribute: [],
              variant: [],
              short_description: 'NA',
              custom_field: [],
            };
            if (singleProduct.feature_image) {
              setFeaturedImage(BASE_URL + singleProduct.feature_image);
            }
            if (singleProduct.gallery_image.length > 0) {
              var allGalleryImage = singleProduct.gallery_image.map(
                gallery => BASE_URL + gallery,
              );
              setGalleryImages(allGalleryImage);
            }

            setGroups(cvdata);
            setAddProductDetail(newData);
            setProduct(singleProduct);
            console.log(cvdata, 'ccdd');
          }
        }}
        placeholder={'Select Product'}
        color="black"
        padding={0}
        searchenabled={true}
        fs={15}
        paddingLeft={0}
        fontColr={'#707070'}
        vzindex={99}
        valueSchema={'_id'}
        br={5}
        marHori={10}
      />
      {/* </View> */}
      <AddProductView
        navigation={navigation}
        addProductDetail={addProductDetail}
        featuredImage={featuredImage}
        galleryImages={galleryImages}
        onBlurNameInput={value => onBlurNameInput(value)}
        inputChange={(name, value) => onValueChange(name, value)}
        objectInputChange={(object, name, value) =>
          onNestedObjectValueChange(object, name, value)
        }
        featureImageAdd={img => featureImageAdd(img)}
        galleyImageAdd={img => galleryImageAdd(img)}
        removeGalleryImage={img => removeGalleryImage(img)}
        removeFeaturedImage={removeFeaturedImage}
        categories={allCategories}
        attributes={allAttributes}
        brands={allBrands}
        onAdd={addProductSubmit}
        allTaxes={allTaxes}
        allShipppings={allShipppings}
        onAttrAndVariantParent={(variantItem, attributeItem) =>
          onAttrAndVariant(variantItem, attributeItem)
        }
        groups={groups}
        setGroups={setGroups}
        setAddProductDetail={setAddProductDetail}
        removeItemFromGroup={removeItemFromGroup}
        removeValueAtIndex={removeValueAtIndex}
      />
    </>
  );
};

export default AddProductsScreen;
