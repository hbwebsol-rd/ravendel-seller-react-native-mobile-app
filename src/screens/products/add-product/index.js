import React, {useState, useEffect} from 'react';
import AppHeader from '../../components/header';
import AddProductView from './view';
import {Alert, Text} from 'react-native';
import {
  GET_CATEGORIES,
  GET_PRODUCTS,
  GET_URL,
} from '../../../queries/productQueries';
import {GET_BRANDS} from '../../../queries/brandsQueries';
import {GET_ATTRIBUTES} from '../../../queries/attributesQueries';
import {GET_TAX} from '../../../queries/taxQueries';
import {GET_SHIPPING} from '../../../queries/shippingQueries';
import AppLoader from '../../components/loader';
import {useMutation, useQuery} from '@apollo/client';
import {unflatten, isEmpty, getUpdatedUrl} from '../../../utils/helper';
import {ADD_PRODUCT} from '../../../queries/productQueries';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';
import AwesomeAlert from 'react-native-awesome-alerts';
import {mutation, query} from '../../../utils/service';
import {Picker} from '@react-native-picker/picker';

var addObject = {
  name: 'Test',
  description: 'test',
  url: '',
  categoryId: [],
  brand: null,
  pricing: {
    price: 10,
    sellprice: 8,
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
  short_description: 'NA',
  custom_field: [],
};

const AddProductsScreen = ({navigation}) => {
  const [addProduct, {loading: AddLoading}] = useMutation(ADD_PRODUCT, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data, ' after add');
      // GraphqlSuccess('Added successfully');
      setAddProductDetail(addObject);
      navigation.navigate('ProductsScreen', {
        screen: 'AllProduct',
        params: {reload: true},
      });
    },
  });
  const Categories = useQuery(GET_CATEGORIES);
  const Brands = useQuery(GET_BRANDS);
  const AttributesData = useQuery(GET_ATTRIBUTES);
  const Taxes = useQuery(GET_TAX);
  const Shippings = useQuery(GET_SHIPPING);
  const productData = useQuery(GET_PRODUCTS);

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
  const [showAlert, setShowAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [addProductDetail, setAddProductDetail] = useState({
    name: '',
    description: '',
    url: '',
    categoryId: [],
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
    short_description: 'NA',
    custom_field: [],
  });
  const convertData = data => {
    const result = [];

    // Create an object to store groups and their corresponding attributes
    const groups = {};

    // Iterate through the data
    data.forEach(item => {
      // Check if the group already exists in the groups object
      if (!groups[item.group]) {
        // If the group doesn't exist, create a new entry in the groups object
        groups[item.group] = {
          name: item.group,
          attributes: [{key: item.key, value: item.value}],
        };
      } else {
        // If the group exists, push the attribute to the existing group
        groups[item.group].attributes.push({key: item.key, value: item.value});
      }
    });

    // Convert the groups object to an array of values
    for (const groupName in groups) {
      result.push(groups[groupName]);
    }

    return result;
  };
  const [groups, setGroups] = useState([
    {name: '', attributes: [{key: '', value: '', keyId: '', valueId: ''}]},
  ]);
  useEffect(() => {
    if (Categories.data && Categories.data.productCategories) {
      var selectedCat = JSON.parse(
        JSON.stringify(Categories.data.productCategories.data),
      );
      if (selectedCat && selectedCat.length) {
        setAllCategories(unflatten(selectedCat));
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
    console.log(addProductDetail, typeof value, ' add pro');
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
          onPress: () =>
            setAddProductDetail({...addProductDetail, feautred_image: ''}),
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
            var filterGalleryImages = addProductDetail.gallery_image.filter(
              gallery_img => gallery_img !== img,
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
    console.log(url, 'uuu');
    let updatedUrl = await mutation(GET_URL, {url: url}); //getUpdatedUrl('Product', url);
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
    } = addProductDetail;
    var CategoryIDs = addProductDetail.categoryId.map(cat => cat.id);
    console.log(JSON.stringify(groups), 'grps');

    const result = [];
    groups.forEach(group => {
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

    console.log(JSON.stringify(result), ' result of data');

    if (isEmpty(addProductDetail.name)) {
      setValidationMessage('Name is Required');
      setShowAlert(true);
      return;
    } else if (isEmpty(CategoryIDs)) {
      setValidationMessage('Category is Required');
      setShowAlert(true);
      return;
    } else if (isEmpty(description)) {
      setValidationMessage('Description is Required');
      setShowAlert(true);
      return;
    } else if (isEmpty(pricing)) {
      setValidationMessage('Price is Required');
      setShowAlert(true);
      return;
    } else if (isEmpty(sku)) {
      setValidationMessage('SKU is Required');
      setShowAlert(true);
      return;
    } else if (isEmpty(quantity)) {
      setValidationMessage('Quantity is Required');
      setShowAlert(true);
      return;
    }

    var details = {
      name: name,
      url: url,
      categoryId: CategoryIDs,
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
      tax_class: tax_class,
      meta: meta,
      custom_field: custom_field,
      attribute: attribute,
      variant: variant,
      combinations: combinations,
      specifications: result,
    };
    console.log('AddProductSubmit details', details);
    addProduct({variables: details});
  };

  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <>
      {AddLoading || loader ? <AppLoader /> : null}
      <AppHeader title="Add Product" navigation={navigation} back />
      <Text style={{fontSize: 15, marginLeft: 8, fontWeight: '600'}}>
        Clone Product
      </Text>
      <Picker
        style={{marginBottom: 10}}
        selectedValue={product}
        onValueChange={singleProduct => {
          console.log(JSON.stringify(singleProduct.specifications), 'ivv');
          const cvdata = convertData(singleProduct.specifications);
          console.log(JSON.stringify(cvdata), ' cvdaata');
          const newData = {
            _id: singleProduct._id,
            name: singleProduct.name,
            description: singleProduct.description,
            url: singleProduct.url,
            categoryId: singleProduct.categoryId,
            brand: singleProduct.brand.id,
            pricing: {
              price: singleProduct.pricing.price,
              sellprice: singleProduct.pricing.sellprice,
            },
            status: singleProduct.status,
            meta: {
              description: singleProduct.meta.description,
              keywords: singleProduct.meta.keywords,
              title: singleProduct.meta.title,
            },
            shipping: {
              depth: singleProduct.shipping.depth,
              height: singleProduct.shipping.height,
              shippingClass: singleProduct.shipping.shippingClass,
              weight: singleProduct.shipping.weight,
              width: singleProduct.shipping.width,
            },
            tax_class: singleProduct.taxClass,
            feature_product: singleProduct.feature_product,
            product_type: singleProduct.product_type,
            quantity: singleProduct.quantity,
            sku: singleProduct.sku,
            feautred_image: singleProduct.feature_image,
            gallery_image: singleProduct.gallery_image,
            attribute: [],
            variant: [],
            short_description: 'NA',
            custom_field: [],
          };
          setAddProductDetail(newData);
          setProduct(singleProduct);
          setGroups(cvdata);
        }}>
        <Picker.Item label="Select Key" value="" />
        {allProducts.map(value => (
          <Picker.Item key={value._id} label={value.name} value={value} />
        ))}
      </Picker>
      {console.log(JSON.stringify(addProductDetail), ' adpoop')}
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
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={validationMessage}
        messageStyle={{display: 'none'}}
        message={validationMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={false}
        cancelText="Close"
        // confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlert();
        }}
        // onConfirmPressed={() => {
        //   this.hideAlert();
        // }}
      />
    </>
  );
};

export default AddProductsScreen;
