import React, {useState, useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';
import {
  AddWrapper,
  TopBar,
  AddFormWrapper,
  AddFormSectionTitle,
  AddFormSections,
} from '../add-product/styles';
import {Input, CheckBox, Button, BottomSheet, ListItem} from '@rneui/themed';
import {isEmpty} from '../../../utils/helper';
import BottomDivider from '../../components/bottom-divider';
import CustomPicker from '../../components/custom-picker';
import * as ImagePicker from 'react-native-image-picker';
import Colors from '../../../utils/color';
import Editor from '../components/editor';
import GalleryImage from '../components/gallery-image';
import FeaturedImage from '../components/feature-image';
import Accordion from '../../components/accordion';
import CategoriesSelections from '../../components/categories-selection';
import Attributes from '../components/attributes';
import AppLoader from '../../components/loader';
import URLComponents from '../../components/urlComponents';
import TaxComponent from '../components/tax';
import ShippingComponent from '../components/shipping';
import MetaInfoComponents from '../components/meta-info';
import InventoryComponents from '../components/inventory';
import Specification from '../components/specification';

/* =============================Upload Featured Image and Gallery Options============================= */
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const EditProductView = ({
  navigation,
  editProductDetail,
  featuredImage,
  galleryImages,
  inputChange,
  objectInputChange,
  onFeaturedImageAdd,
  onFeaturedImageRemove,
  onGalleryImagesAdd,
  onGalleryImagesRemove,
  update,
  allCategories,
  allAttributes,
  allBrands,
  allTaxes,
  allShipppings,
  onAttrAndVariantParent,
  groups,
  setGroups,
}) => {
  /* =============================States============================= */
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadImageOf, setUploadImageOf] = useState('');
  const {
    name,
    description,
    status,
    featured_product,
    pricing,
    product_type,
    meta,
    quantity,
    sku,
    brand,
    categoryId,
    url,
    attribute,
    variant,
    variation_master,
    shipping,
    tax_class,
  } = editProductDetail;

  /* =============================Upload Featured Image and Gallery Image Function============================= */
  const UploadImage = response => {
    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      if (uploadImageOf === 'feature_image') {
        onFeaturedImageAdd(response.uri);
        inputChange('update_feature_image', response.uri);
      }
      if (uploadImageOf === 'gallery_image') {
        onGalleryImagesAdd(response.uri);
      }
    }
    setUploadModal(false);
  };

  /* =============================Upload Featured Image and Gallery Lists============================= */
  const uploadModalBtn = [
    {
      title: 'Take Photo',
      onPress: () => {
        ImagePicker.launchCamera(options, response => {
          UploadImage(response);
        });
      },
    },
    {
      title: 'Choose from library',
      onPress: () => {
        ImagePicker.launchImageLibrary(options, response => {
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

  return (
    <AddWrapper>
      {Attributes.loading ? <AppLoader /> : null}
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
        <Button title="Save" onPress={update} />
      </TopBar>
      <AddFormWrapper>
        {/* =================================Product Information============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Information</AddFormSectionTitle>
          <Input
            label="Name"
            value={name}
            onChangeText={value => inputChange('name', value)}
          />

          <URLComponents
            url={url}
            updateOf="Product"
            changePermalink={value => inputChange('url', value)}
            updatePermalink={value => inputChange('url', value)}
          />

          <Editor
            data={description}
            onEditorChange={value => inputChange('description', value)}
          />
        </AddFormSections>

        {/* =================================Featured Image============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Featured Image</AddFormSectionTitle>
          <FeaturedImage
            image={featuredImage}
            removeImage={onFeaturedImageRemove}
            addImage={() => {
              setUploadModal(true);
              setUploadImageOf('feature_image');
            }}
          />
        </AddFormSections>

        {/* =================================Gallery Image============================== */}
        <AddFormSections>
          <AddFormSectionTitle>Gallery Image</AddFormSectionTitle>
          <GalleryImage
            images={galleryImages}
            removeImage={img => onGalleryImagesRemove(img)}
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
            onChangeText={value =>
              objectInputChange('pricing', 'price', parseInt(value))
            }
          />

          <Input
            keyboardType="numeric"
            type="number"
            label="Sale Price"
            value={pricing.sellprice.toString()}
            onChangeText={value =>
              objectInputChange('pricing', 'sellprice', parseInt(value))
            }
          />
        </AddFormSections>

        {/* =================================Product Category============================== */}
        {allCategories.length > 0 ? (
          <SafeAreaView style={{flex: 1}}>
            <CategoriesSelections
              data={allCategories}
              selectedItems={categoryId}
              onCategoryChange={items => inputChange('categoryId', items)}
            />
          </SafeAreaView>
        ) : null}

        {/* =================================Featured Product============================== */}
        <AddFormSections>
          <CheckBox
            title="Featured Product"
            checked={featured_product}
            onPress={() => inputChange('featured_product', !featured_product)}
          />
        </AddFormSections>

        {/* =================================Attributes============================== */}
        {allAttributes.length > 0 ? (
          <AddFormSections>
            <AddFormSectionTitle>Attributes</AddFormSectionTitle>
            {/* <Attributes
              data={allAttributes}
              attribute={attribute}
              variant={variant}
              variation_master={variation_master}
              editMode
              onCombinationUpdate={combinations => {
                inputChange('combinations', combinations);
              }}
              onAttrAndVariant={(variantItem, attributeItem) => {
                onAttrAndVariantParent(variantItem, attributeItem);
              }}
            /> */}
            <AddFormSections>
              <Specification
                data={allAttributes}
                attribute={attribute}
                variant={variant}
                // onCombinationUpdate={combinations =>
                //   inputChange('combinations', combinations)
                // }
                // onAttrAndVariant={(variantItem, attributeItem) => {
                //   onAttrAndVariantParent(variantItem, attributeItem);
                // }}
                groups={groups}
                setGroups={setGroups}
              />
            </AddFormSections>
          </AddFormSections>
        ) : null}

        {/* =================================Product Tax============================== */}
        <Accordion title="Tax">
          <TaxComponent
            taxState={allTaxes}
            tax_class={tax_class}
            onTaxChange={tax_class => inputChange('tax_class', tax_class)}
          />
        </Accordion>
        {/* =================================Product Shipping============================== */}
        {!isEmpty(shipping) && !product_type?.virtual ? (
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
        {allBrands.length > 0 ? (
          <Accordion title="Brands">
            <CustomPicker
              iosDropdown
              pickerKey="name"
              pickerVal="id"
              selectedValue={brand && brand.id ? brand.id : ''}
              androidPickerData={allBrands}
              iosPickerData={allBrands}
              pickerValChange={val => inputChange('brand', val)}
              placeholder="Please Select"
              label="Brand"
            />
          </Accordion>
        ) : null}

        {/* =================================Product Type============================== */}
        <Accordion title="Product Type">
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              title="Virtual"
              checked={product_type?.virtual}
              onPress={() =>
                objectInputChange(
                  'product_type',
                  'virtual',
                  !product_type?.virtual,
                )
              }
            />

            <CheckBox
              title="Downloadable"
              checked={product_type?.downloadable}
              onPress={() =>
                objectInputChange(
                  'product_type',
                  'downloadable',
                  !product_type?.downloadable,
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

export default EditProductView;
