import React, {useEffect, useState} from 'react';
import AppHeader from '../../components/header';
import EditProductView from './view';
import {useMutation, useQuery} from '@apollo/client';
import AppLoader from '../../components/loader';
import {GET_PRODUCT, UPDATE_PRODUCT} from '../../../queries/productQueries';
import {useIsFocused} from '@react-navigation/native';
import {Alert} from 'react-native';
import {GET_CATEGORIES} from '../../../queries/productQueries';
import {GET_BRANDS} from '../../../queries/brandsQueries';
import {GET_ATTRIBUTES} from '../../../queries/attributesQueries';
import {GET_TAX} from '../../../queries/taxQueries';
import {GET_SHIPPING} from '../../../queries/shippingQueries';
import {
  unflatten,
  allPossibleCases,
  isEmpty,
  convertData,
  URL,
} from '../../../utils/helper';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const EditProductsScreen = ({route, navigation}) => {
  const Categories = useQuery(GET_CATEGORIES);
  const Brands = useQuery(GET_BRANDS);
  const AttributesData = useQuery(GET_ATTRIBUTES);
  const Taxes = useQuery(GET_TAX);
  const Shippings = useQuery(GET_SHIPPING);
  const isFocused = useIsFocused();
  const [productDetail, setProductDetail] = useState({
    _id: '7676',
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
    taxClass: '',
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
  const [featuredImage, setFeaturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const {loading, error, data} = useQuery(GET_PRODUCT, {
    variables: {id: route.params.id},
  });
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [allTaxes, setAllTaxes] = useState({});
  const [allShipppings, setAllShippings] = useState({});

  const [groups, setGroups] = useState([
    {name: '', attributes: [{key: '', value: '', keyId: '', valueId: ''}]},
  ]);

  // console.log(data.product.data.pricing);

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
        allShipppings?.data?.shippingClass.length &&
        allTaxes.data.taxClass.length
      ) {
        setProductDetail({
          ...productDetail,
          shipping: {
            ...productDetail.shipping,
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

  useEffect(() => {
    if (isFocused) {
      if (data && data.product) {
        var singleProduct = data.product.data;
        if (singleProduct.feature_image) {
          setFeaturedImage(URL + singleProduct.feature_image);
        }
        if (singleProduct.gallery_image.length > 0) {
          var allGalleryImage = singleProduct.gallery_image.map(
            gallery => URL + gallery,
          );
          setGallery(allGalleryImage);
        }
        const cvdata = convertData(singleProduct.specifications);
        console.log(singleProduct?.categoryTree, ' cattree');
        const newData = {
          _id: singleProduct._id,
          name: singleProduct.name,
          description: singleProduct.description,
          url: singleProduct.url,
          categoryId: singleProduct.categoryId?.map(cat => cat.id),
          categoryTree: singleProduct?.categoryTree || [],
          brand: singleProduct.brand,
          pricing: {
            price: singleProduct.pricing.price,
            sellprice: singleProduct.pricing.sellprice,
            discountPercentage: singleProduct.pricing.discountPercentage,
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
        setProductDetail(newData);
        setGroups(cvdata);
      }
    } else {
      setProductDetail({});
    }
  }, [data, isFocused]);

  const onValueChange = (name, value) => {
    setProductDetail({...productDetail, [name]: value});
  };

  const onNestedObjectValueChange = (object, name, value) => {
    productDetail[object][name] = value.toString();

    setProductDetail({...productDetail});
  };

  const onGalleryImagesAdd = img => {
    var updatedImages = productDetail.update_gallery_image || [];
    updatedImages.push(img);
    productDetail.update_gallery_image = updatedImages;
    // productDetail.gallery_image.push(img);
    setProductDetail({...productDetail});
    setGallery([...gallery, img]);
  };

  const onGalleryImagesRemove = img => {
    console.log(img);
    if (img?._id) {
      let galleryImages = productDetail.gallery_image;
      let removed_image = productDetail.removed_image || [];
      removed_image.push(img?._id);
      setProductDetail({
        ...productDetail,
        gallery_image: galleryImages.filter(
          galleryImg => galleryImg?._id !== img?._id,
        ),
        removed_image,
      });
      return;
    }
    setGallery(gallery.filter(galleryImg => galleryImg !== img));
  };

  const onFeaturedImageAdd = img => setFeaturedImage(img);
  const onFeaturedImageRemove = () => setFeaturedImage(null);

  const [updateProduct, {loading: UpdateLoading}] = useMutation(
    UPDATE_PRODUCT,
    {
      onError: error => {
        GraphqlError(error);
      },
      onCompleted: data => {
        GraphqlSuccess('Updated Successfully');
        setProductDetail({});
        navigation.goBack();
      },
    },
  );

  const onAttrAndVariant = (variantItem, attributeItem) => {
    productDetail.variant = variantItem;
    productDetail.attribute = attributeItem;
    setProductDetail({...productDetail});
  };

  const UpdateProductSubmit = () => {
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
    } = productDetail;
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
    var CategoryIDs = productDetail.categoryId.map(cat => cat.id);

    if (isEmpty(name)) {
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
      _id: productDetail._id,
      name: name,
      url: url,
      categoryId: CategoryIDs,
      brand: brand.id,
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
      specifications: result,
      // attribute: attribute,
      // variant: variant,
      // combinations: combinations,
      update_gallery_image: productDetail?.update_gallery_image || '',
      removed_image: productDetail?.removed_image || '',
      update_feature_image: productDetail?.update_feature_image || '',
    };
    console.log('UpdateProductSubmit details', details);
    updateProduct({variables: details});
  };

  return (
    <>
      {loading ||
      UpdateLoading ||
      Categories.loading ||
      Brands.loading ||
      AttributesData.loading ? (
        <AppLoader />
      ) : null}
      <AppHeader title="Edit Product" navigation={navigation} back />
      {!isEmpty(productDetail) && !isEmpty(productDetail._id) ? (
        <EditProductView
          editProductDetail={productDetail}
          featuredImage={featuredImage}
          onFeaturedImageAdd={img => onFeaturedImageAdd(img)}
          onFeaturedImageRemove={onFeaturedImageRemove}
          galleryImages={gallery}
          onGalleryImagesAdd={img => onGalleryImagesAdd(img)}
          onGalleryImagesRemove={img => onGalleryImagesRemove(img)}
          navigation={navigation}
          inputChange={(name, value) => onValueChange(name, value)}
          objectInputChange={(object, name, value) =>
            onNestedObjectValueChange(object, name, value)
          }
          update={UpdateProductSubmit}
          allCategories={allCategories}
          allAttributes={allAttributes}
          allBrands={allBrands}
          allTaxes={allTaxes}
          allShipppings={allShipppings}
          onAttrAndVariantParent={(variantItem, attributeItem) =>
            onAttrAndVariant(variantItem, attributeItem)
          }
          groups={groups}
          setGroups={setGroups}
        />
      ) : null}
    </>
  );
};

export default EditProductsScreen;
