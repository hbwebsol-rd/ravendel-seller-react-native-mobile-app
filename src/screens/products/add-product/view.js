import React, {useState} from 'react';
import {PermissionsAndroid, View} from 'react-native';
import {
  AddWrapper,
  TopBar,
  AddFormWrapper,
  AddFormSectionTitle,
  AddFormSections,
} from './styles';
import {Input, CheckBox, Button, BottomSheet, ListItem} from '@rneui/themed';
import BottomDivider from '../../components/bottom-divider';
import CustomPicker from '../../components/custom-picker';
import * as ImagePicker from 'react-native-image-picker';
import Colors from '../../../utils/color';
import Editor from '../components/editor';
import GalleryImage from '../components/gallery-image';
import FeaturedImage from '../components/feature-image';
import Accordion from '../../components/accordion';
import CategoriesSelections from '../../components/categories-selection';
import TaxComponent from '../components/tax';
import ShippingComponent from '../components/shipping';
import MetaInfoComponents from '../components/meta-info';
import InventoryComponents from '../components/inventory';
import URLComponents from '../../components/urlComponents';
import Specification from '../components/specification';
import {Text} from '@rneui/base';
import {getCheckedIds, getDiscount} from '../../../utils/helper';
import ImgToBase64 from 'react-native-image-base64';
import EditCategoriesComponent from '../../components/edit-category';

/* =============================Upload Featured Image and Gallery Options============================= */
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const AddProductView = ({
  navigation,
  addProductDetail,
  inputChange,
  onBlurNameInput,
  objectInputChange,
  featureImageAdd,
  galleyImageAdd,
  removeFeaturedImage,
  removeGalleryImage,
  categories,
  attributes,
  brands,
  galleryImages,
  featuredImage,
  onAdd,
  allTaxes,
  allShipppings,
  onAttrAndVariantParent,
  groups,
  setGroups,
  setAddProductDetail,
}) => {
  /* =============================States============================= */
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadImageOf, setUploadImageOf] = useState('');

  /* =============================Upload Featured Image and Gallery Image Function============================= */
  const UploadImage = response => {
    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log(response, ' img res');
      // const source = {uri: 'data:image/jpeg;base64,' + response.data};
      // console.log('image source', source);

      ImgToBase64.getBase64String(response.assets[0].uri).then(base64String => {
        const image = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].uri.substr(
            response.assets[0].uri.lastIndexOf('/') + 1,
          ),
          file: 'data:image/png;base64' + base64String,
        };
        console.log('response.uri', response.uri);
        console.log('image', image);

        if (uploadImageOf === 'feautred_image') {
          featureImageAdd(image);
        }

        if (uploadImageOf === 'gallery_image') {
          galleyImageAdd(image);
        }
        // gImage.push({
        //   file: 'base64String',
        // });
      });
    }
    setUploadModal(false);
  };

  /* =============================Upload Featured Image and Gallery Lists============================= */
  const uploadModalBtn = [
    {
      title: 'Take Photo',
      onPress: () => {
        requestCameraPermission();
        // ImagePicker.launchCamera(options, response => {
        //   UploadImage(response);
        // });
      },
    },
    {
      title: 'Choose from library',
      onPress: () => {
        ImagePicker.launchImageLibrary(options, response => {
          console.log(response, ' image picker res');
          UploadImage(response);
        });
      },
    },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: Colors.deleteColor},
      titleStyle: {color: 'white'},
      onPress: () => setUploadModal(false),
    },
  ];

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(options, response => {
          UploadImage(response);
        });
      } else {
        Alert.alert('Camera permission denied', '', [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const {
    name,
    description,
    categoryId,
    brand,
    pricing,
    status,
    meta,
    url,
    shipping,
    tax_class,
    feature_product,
    product_type,
    quantity,
    sku,
    feautred_image,
    gallery_image,
    attribute,
    variant,
    short_description,
    categoryTree,
  } = addProductDetail;
  return (
    <AddWrapper>
      <TopBar>
        <CheckBox
          title="Draft"
          checked={status === 'Draft'}
          onPress={() => inputChange('status', 'Draft')}
        />
        <CheckBox
          title="Publish"
          checked={status === 'Publish'}
          onPress={() => inputChange('status', 'Publish')}
        />
        <Button title="Add" onPress={onAdd} />
      </TopBar>
      <AddFormWrapper>
        {/* =================================Product Information============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Information</AddFormSectionTitle>
          <Input
            label="Name"
            value={name}
            onChangeText={value => inputChange('name', value)}
            onEndEditing={event => {
              let value =
                !!event.nativeEvent && !!event.nativeEvent.text
                  ? event.nativeEvent.text
                  : event;
              onBlurNameInput(value);
            }}
          />

          {url ? (
            <URLComponents
              url={url}
              updateOf="Product"
              changePermalink={value => inputChange('url', value)}
              updatePermalink={value => inputChange('url', value)}
            />
          ) : null}

          <Editor
            data={description}
            onEditorChange={value => inputChange('description', value)}
          />

          <Input
            labelStyle={{marginTop: 15}}
            inputContainerStyle={{height: 50}}
            style={{marginTop: 10}}
            label="Short Description"
            value={short_description}
            onChangeText={value => inputChange('short_description', value)}
          />
        </AddFormSections>

        {/* =================================Featured Image============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Featured Image</AddFormSectionTitle>
          <FeaturedImage
            image={featuredImage}
            removeImage={removeFeaturedImage}
            addImage={() => {
              setUploadModal(true);
              setUploadImageOf('feautred_image');
            }}
          />
        </AddFormSections>

        {/* =================================Gallery Image============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Gallery Image</AddFormSectionTitle>
          <GalleryImage
            images={galleryImages}
            removeImage={img => removeGalleryImage(img)}
            addImage={() => {
              setUploadModal(true);
              setUploadImageOf('gallery_image');
            }}
          />
        </AddFormSections>

        {/* =================================Product Price============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Pricing</AddFormSectionTitle>
          <Input
            keyboardType="numeric"
            type="number"
            label="Price"
            value={pricing.price.toString()}
            onChangeText={value => {
              if (value === '') {
                objectInputChange('pricing', 'price', '');
              } else {
                objectInputChange('pricing', 'price', parseInt(value));
              }
            }}
          />
          <Input
            keyboardType="numeric"
            type="number"
            label="Sale Price"
            value={pricing.sellprice.toString()}
            onChangeText={value => {
              if (value === '') {
                objectInputChange('pricing', 'sellprice', '');
              } else {
                objectInputChange('pricing', 'sellprice', parseInt(value));
                if (pricing.price > pricing.sellprice) {
                  objectInputChange(
                    'pricing',
                    'discountPercentage',
                    getDiscount(pricing.price, pricing.sellprice),
                  );
                }
              }
            }}
          />

          <Text style={{fontWeight: 'bold', marginLeft: 10}}>
            Discount Percentage :{' '}
            {pricing.price > pricing.sellprice
              ? getDiscount(pricing.price, pricing.sellprice) + '%'
              : 'No Discount'}
          </Text>
        </AddFormSections>
        {/* =================================Product Category============================== */}
        {/* <CategoriesSelections
          data={categories}
          selectedItems={categoryId}
          onCategoryChange={items => inputChange('categoryId', items)}
        /> */}

        <EditCategoriesComponent
          data={categories}
          selectedCategoriesTree={categoryTree}
          selectedCategories={categoryId}
          onCategoryChange={items => {
            if (items && items?.length > 0) {
              console.log(items, ' ioio');
              const checkedIds = getCheckedIds(items);
              console.log(checkedIds);

              setAddProductDetail({
                ...addProductDetail,
                categoryId: checkedIds,
                categoryTree: items,
              });
            } else {
              setAddProductDetail({
                ...addProductDetail,
                categoryId: [],
                categoryTree: [],
              });
            }
          }}
        />
        {/* =================================Featured Product============================== */}
        <AddFormSections>
          <CheckBox
            title="Featured Product"
            checked={feature_product}
            onPress={() => inputChange('feature_product', !feature_product)}
          />
        </AddFormSections>

        {/* =================================Attributes============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Attributes</AddFormSectionTitle>

          <Specification
            data={attributes}
            attribute={attribute}
            variant={variant}
            onCombinationUpdate={combinations =>
              inputChange('combinations', combinations)
            }
            onAttrAndVariant={(variantItem, attributeItem) => {
              onAttrAndVariantParent(variantItem, attributeItem);
            }}
            groups={groups}
            setGroups={setGroups}
          />
        </AddFormSections>

        {/* =================================Product Tax============================== */}
        <Accordion title="Tax">
          <TaxComponent
            taxState={allTaxes}
            tax_class={tax_class}
            onTaxChange={tax_class => inputChange('tax_class', tax_class)}
          />
        </Accordion>

        {/* =================================Product Shipping============================== */}
        {!product_type.virtual ? (
          <ShippingComponent
            shippingState={allShipppings}
            shipping={shipping}
            onShipppingChange={value =>
              objectInputChange('shipping', 'shippingClass', value)
            }
            onShippingInput={(name, value) =>
              objectInputChange('shipping', name, value)
            }
          />
        ) : null}

        {/* =================================Product Brand============================== */}
        <Accordion title="Brands">
          <CustomPicker
            iosDropdown
            pickerKey="name"
            pickerVal="id"
            androidPickerData={brands.data}
            iosPickerData={brands.data}
            selectedValue={brand}
            pickerValChange={val => inputChange('brand', val)}
            placeholder="Please Select"
            label="Brand"
          />
        </Accordion>

        {/* =================================Product Type============================== */}
        <Accordion title="Product Type">
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              title="Virtual"
              checked={product_type.virtual}
              onPress={() =>
                objectInputChange(
                  'product_type',
                  'virtual',
                  !product_type.virtual,
                )
              }
            />
            <CheckBox
              title="Downloadable"
              checked={product_type.downloadable}
              onPress={() =>
                objectInputChange(
                  'product_type',
                  'downloadable',
                  !product_type.downloadable,
                )
              }
            />
          </View>
        </Accordion>

        {/* =================================Inventory============================== */}
        <InventoryComponents
          sku={sku}
          quantity={quantity}
          onInventoryInputChange={(name, value) => inputChange(name, value)}
        />

        {/* =================================Meta Information============================== */}
        <MetaInfoComponents
          meta={meta}
          onMetaInputChange={(name, value) =>
            objectInputChange('meta', name, value)
          }
        />

        {/* =================================Upload Modal============================== */}
        <BottomSheet isVisible={uploadModal}>
          {uploadModalBtn.map((l, i) => (
            <ListItem
              bottomDivider
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </AddFormWrapper>

      <BottomDivider />
    </AddWrapper>
  );
};

export default AddProductView;
