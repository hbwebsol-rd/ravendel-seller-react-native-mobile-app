import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, CheckBox, Input, BottomSheet, ListItem} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../utils/color';
import {
  allPossibleCases,
  BASE_URL,
  isEmpty,
  deleteProductVariation,
} from '../../../utils/helper';
import Accordion from '../../components/accordion';
import * as ImagePicker from 'react-native-image-picker';
import styled from 'styled-components';
import AttrMulipleSelect from './attributes-multipleselect';
import {
  HeaderOpenStyle,
  AccordionWrapper,
  AccordionHeader,
  AccordionTitle,
  AccordionBody,
} from '../components/accordion-styles';

const Attributes = ({
  data,
  attribute,
  variant,
  variation_master,
  editMode,
  onCombinationUpdate,
  onAttrAndVariant,
}) => {
  const [currentVariants, setcurrentVariants] = useState({
    combinations: [],
    allValues: {},
  });
  const [currentAttribute, setcurrentAttribute] = useState({
    id: '',
    attribute_list: [],
  });
  const [uploadModal, setUploadModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState('');

  useEffect(() => {
    if (onCombinationUpdate) {
      onCombinationUpdate(currentVariants.combinations);
    }
  }, [currentVariants]);

  useEffect(() => {
    if (editMode) {
      for (let i of data) {
        for (let j of i.values) {
          currentVariants.allValues[j._id] = j.name;
        }
      }

      if (data.length) {
        let attrWithValue = {};
        for (const attr of attribute) {
          if (!Array.isArray(attrWithValue[attr.attribute_id])) {
            attrWithValue[attr.attribute_id] = [];
          }
          attrWithValue[attr.attribute_id].push(attr.attribute_value_id);
        }
        currentAttribute.attribute_list = [];
        for (let i in attrWithValue) {
          let values = [];
          let selected_values = [];

          for (let attr of data) {
            if (i === attr.id) {
              for (let j of attr.values) {
                if (~attrWithValue[i].indexOf(j._id)) {
                  selected_values.push({value: j._id, label: j.name});
                }
                values.push({value: j._id, label: j.name});
              }

              currentAttribute.attribute_list.push({
                id: attr.id,
                name: attr.name,
                isVariant: variant.some(vr => vr === attr.id),
                selected_values: selected_values,
                values: values,
              });

              break;
            }
          }
        }

        currentVariants.combinations = variation_master;

        setcurrentAttribute({
          ...currentAttribute,
        });

        setcurrentVariants({
          ...currentVariants,
        });

        if (currentAttribute.attribute_list.length > 0) {
          data.map(item => {
            currentAttribute.attribute_list.map(attribute => {
              if (item.id === attribute.id) {
                item.selected = true;
              }
            });
          });
        }
      }
    }
  }, [editMode]);

  useEffect(() => {
    createVariants();
  }, [attribute, variant]);

  useEffect(() => {
    for (let i of data) {
      for (let j of i.values) {
        currentVariants.allValues[j._id] = j.name;
      }
    }
    setcurrentVariants({
      ...currentVariants,
    });
    if (!editMode) {
      data.map(item => {
        item.selected = false;
      });
    }
  }, [data]);

  const addAttribute = () => {
    if (!currentAttribute.id) {
      Alert.alert('Oops!', 'Invalid', [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
      return;
    }

    let values = [];
    let name = '';
    for (let i of data) {
      if (i.id === currentAttribute.id) {
        name = i.name;
        for (let j of i.values) {
          values.push({value: j._id, label: j.name});
        }
        break;
      }
    }

    data.map(item => {
      if (item.id === currentAttribute.id) {
        item.selected = true;
      }
    });

    let attribute_list = {
      id: currentAttribute.id,
      name: name,
      isVariant: false,
      selected_values: [],
      values: values,
    };

    currentAttribute.attribute_list.push(attribute_list);
    currentAttribute.id = '';
    setcurrentAttribute({
      ...currentAttribute,
    });

    createVariants();
  };

  const changeSelectedValue = (items, i) => {
    currentAttribute.attribute_list[i].selected_values = items;
    setcurrentAttribute({
      ...currentAttribute,
    });

    createVariants();
  };

  const deleteAttribute = i => {
    currentAttribute.attribute_list.splice(i, 1);
    setcurrentAttribute({
      ...currentAttribute,
    });
    data.map(item => {
      item.selected = false;
    });
    createVariants();
  };

  const variantDelete = async i => {
    if (currentVariants.combinations[i].hasOwnProperty('id')) {
      await deleteProductVariation(currentVariants.combinations[i].id);
    }
    currentVariants.combinations.splice(i, 1);
    setcurrentVariants({
      ...currentVariants,
    });
  };

  const saveAttribute = () => {
    var attributeItem = [];
    var variantItem = [];
    currentAttribute.attribute_list.forEach((attr, index) => {
      if (attr.selected_values.length) {
        attr.selected_values.forEach(val => {
          attributeItem.push({
            attribute_id: attr.id,
            attribute_value_id: val.value,
          });
        });

        if (attr.isVariant) {
          variantItem.push(attr.id);
        }
      }
    });
    onAttrAndVariant(variantItem, attributeItem);
    createVariants();
  };

  const createVariants = () => {
    let variants = {};
    for (const i of variant) {
      variants[i] = [];
    }

    for (let attr of attribute) {
      if (variants.hasOwnProperty(attr.attribute_id)) {
        variants[attr.attribute_id].push(attr.attribute_value_id);
      }
    }

    if (!Object.keys(variants).length) {
      return;
    }

    variants = Object.values(variants);
    let combinations = allPossibleCases(variants);

    let countMatch = [];
    let generatedVariants = [];

    combinations.forEach((comb, i) => {
      countMatch = [];
      currentVariants.combinations.forEach((prevComb, j) => {
        countMatch[j] = 0;
        prevComb.combination.forEach(v => {
          if (~comb.indexOf(v)) {
            countMatch[j] = countMatch[j] + 1;
          }
        });
      });

      var max = 0;
      var index = 0;
      countMatch.forEach((val, key) => {
        if (val > max) {
          max = countMatch[key];
          index = key;
        }
      });

      if (max) {
        generatedVariants.push({
          combination: comb,
          sku: currentVariants.combinations[index].sku,
          quantity: currentVariants.combinations[index].quantity,
          price: currentVariants.combinations[index].price,
          image: currentVariants.combinations[index].image,
        });

        currentVariants.combinations.splice(index, 1);
      } else {
        generatedVariants.push({
          combination: comb,
          sku: '',
          quantity: '',
          price: '',
          image: {},
        });
      }
    });

    currentVariants.combinations = generatedVariants;
    setcurrentVariants({
      ...currentVariants,
    });
  };

  const variantChange = (name, value, index) => {
    if (name === 'image') {
      currentVariants.combinations[index][name].file = value;
      currentVariants.combinations[index][name].view = value;
    } else {
      currentVariants.combinations[index][name] = value;
    }

    setcurrentVariants({
      ...currentVariants,
    });
  };

  /* =============================Upload Variant Image ============================= */
  const UploadImageOptions = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  /* =============================Upload Variant Image Function============================= */
  const UploadImage = response => {
    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      variantChange('image', response.uri, currentIndex);
      console.log('response.uri', response.uri, currentIndex);
    }
    setUploadModal(false);
  };

  /* =============================Upload Variant Image Lists============================= */
  const uploadModalBtn = [
    {
      title: 'Take Photo',
      onPress: () => {
        ImagePicker.launchCamera(UploadImageOptions, response => {
          UploadImage(response);
        });
      },
    },
    {
      title: 'Choose from library',
      onPress: () => {
        ImagePicker.launchImageLibrary(UploadImageOptions, response => {
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

  const [toggleCombinationState, setToggleCombination] = useState([]);

  useEffect(() => {
    if (currentVariants.combinations.length > 0) {
      var cominationToggleArray = [];
      currentVariants.combinations.map((combination, i) => {
        combination.toggleId = i;
        cominationToggleArray.push({id: i, value: false});
      });
      setToggleCombination(cominationToggleArray);
    }
  }, [currentVariants.combinations]);

  const checkCombinationToggle = id => {
    if (toggleCombinationState.length > 0) {
      var item = toggleCombinationState.filter(comb => comb.id === id);
      if (item.length > 0) {
        return item[0].value;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const changeCombinationToggleState = id => {
    toggleCombinationState.map(comb => {
      if (comb.id === id) {
        comb.value = !comb.value;
      }
    });
    setToggleCombination([...toggleCombinationState]);
  };

  return (
    <>
      {data.length > 0 ? (
        <Picker
          selectedValue={currentAttribute.id}
          onValueChange={(itemValue, itemIndex) => {
            var item = data.filter(d => d.id === itemValue);
            if (item.length > 0 && item[0].selected) {
              Alert.alert('Ooops!!', `${item[0].name} is already selected`, [
                {
                  text: 'Ok',
                  style: 'cancel',
                },
              ]);
            } else {
              setcurrentAttribute({
                ...currentAttribute,
                id: itemValue,
              });
            }
          }}>
          <Picker.Item
            value={null}
            label={'Select Attributes'}
            color="rgba(0,0,0,0.5)"
          />
          {data.map((item, index) => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.id}
              color={item.selected ? 'rgba(0,0,0,0.5)' : '#000'}
            />
          ))}
        </Picker>
      ) : null}

      {currentAttribute.id ? (
        <Button title="Add Attributes" onPress={addAttribute} />
      ) : null}

      {currentAttribute.attribute_list.length
        ? currentAttribute.attribute_list.map((attribute, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: 10,
                marginVertical: 10,
                borderWidth: 1,
                borderColor: '#3a3a3a',
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: Colors.primaryColor,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {attribute.name}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteAttribute(index)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Icon name="trash" size={16} color={Colors.deleteColor} />
                  <Text style={{color: Colors.deleteColor, marginLeft: 5}}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
              <CheckBox
                title="Variation"
                checked={attribute.isVariant}
                onPress={e => {
                  attribute.isVariant = !attribute.isVariant;
                  setcurrentAttribute({
                    ...currentAttribute,
                  });
                }}
                containerStyle={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  padding: 0,
                }}
              />
              <AttrMulipleSelect
                items={attribute.values}
                selected={attribute.selected_values}
                onItemChange={items => {
                  changeSelectedValue(items, index);
                }}
                label={`Select ${attribute.name}`}
                itemkey="label"
                value="value"
              />
            </View>
          ))
        : null}

      {currentAttribute.attribute_list.length ? (
        <Button title="Save Attributes" onPress={saveAttribute} />
      ) : null}

      {currentVariants.combinations.length
        ? currentVariants.combinations.map((variant, index) => (
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                // paddingHorizontal: 10,
                marginVertical: 10,
              }}>
              <AccordionWrapper>
                <AccordionHeader
                  onPress={() => {
                    changeCombinationToggleState(variant.toggleId);
                  }}
                  style={
                    checkCombinationToggle(variant.toggleId)
                      ? HeaderOpenStyle
                      : {}
                  }>
                  <AccordionTitle>
                    {variant.combination
                      .map((val, i) => currentVariants.allValues[val])
                      .join(' / ')}
                  </AccordionTitle>
                  <Icon
                    name={
                      checkCombinationToggle(variant.toggleId)
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    color={Colors.primaryColor}
                    size={16}
                  />
                </AccordionHeader>
                <AccordionBody
                  style={{
                    height: checkCombinationToggle(variant.toggleId)
                      ? 'auto'
                      : 0,
                    paddingTop: checkCombinationToggle(variant.toggleId)
                      ? 15
                      : 0,
                  }}>
                  <Input
                    keyboardType="numeric"
                    type="number"
                    label="Price"
                    value={variant.price.toString()}
                    onChangeText={value => variantChange('price', value, index)}
                  />
                  <Input
                    keyboardType="numeric"
                    type="number"
                    label="Quantity"
                    value={variant.quantity.toString()}
                    onChangeText={value =>
                      variantChange('quantity', value, index)
                    }
                  />
                  <Input
                    label="SKU"
                    value={variant.sku}
                    onChangeText={value => variantChange('sku', value, index)}
                  />
                  {!isEmpty(variant.image) &&
                  !isEmpty(variant.image.original) ? (
                    <AttrFeatureImageWrapper>
                      <Image
                        source={{uri: BASE_URL + variant.image.original}}
                        style={{width: 200, height: 200}}
                      />
                      <RemoveFeatuAttrreImageText onPress={() => {}}>
                        <Icon
                          name="close"
                          color={Colors.deleteColor}
                          size={14}
                        />{' '}
                        Remove Image
                      </RemoveFeatuAttrreImageText>
                    </AttrFeatureImageWrapper>
                  ) : (
                    <AttrFeaturedImageUpload
                      onPress={() => {
                        setCurrentIndex(index);
                        setUploadModal(true);
                      }}>
                      <AttrFeaturedImageUploadText>
                        Upload Image
                      </AttrFeaturedImageUploadText>
                    </AttrFeaturedImageUpload>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete Variant?',
                        'Are you sure you want to delete? This action cannot be reversed.',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {text: 'OK', onPress: () => variantDelete(index)},
                        ],
                        {cancelable: false},
                      );
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <Icon name="trash" size={16} color={Colors.deleteColor} />
                    <Text style={{color: Colors.deleteColor, marginLeft: 5}}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </AccordionBody>
              </AccordionWrapper>

              {/* <Accordion
                title={variant.combination
                  .map((val, i) => currentVariants.allValues[val])
                  .join(' / ')}>
                <View>

                </View>
              </Accordion> */}
            </View>
          ))
        : null}

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
    </>
  );
};

export default Attributes;

export const AttrFeaturedImageUpload = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  background-color: #eee;
  margin-top: 10px;
`;
export const AttrFeaturedImageUploadText = styled.Text`
  font-size: 18px;
  text-transform: uppercase;
  opacity: 0.5;
`;
export const AttrFeatureImageWrapper = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #eee;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;
export const RemoveFeatuAttrreImageText = styled.Text`
  color: ${Colors.deleteColor};
  margin-top: 10px;
`;
