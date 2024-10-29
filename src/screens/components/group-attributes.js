import React, {useState, useEffect, useRef} from 'react';
import AIcon from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {
  isEmpty,
  allPossibleCases,
  bucketBaseURL,
  baseUrl,
  imageOnError,
  getBaseUrl,
} from '../../utils/helper';
// import {ALERT_SUCCESS} from '../../../store/reducers/alertReducer';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import AppLoader from './loader';
import {GET_ATTRIBUTES} from '../../queries/attributesQueries';
import {useQuery} from '@apollo/client';
import {GET_PRODUCTS} from '../../queries/productQueries';
import Multiselect from './multiselect';
import {Button} from '@rneui/themed';
import ThemeColor from '../../utils/color';
import {Divider} from '@rneui/base';
import {WINDOW_HEIGHT} from '@gorhom/bottom-sheet';

const AttributesComponent = ({
  product,
  productStateChange,
  onCombinationUpdate,
  EditMode,
  setting,
}) => {
  //   const classes = viewStyles();

  const dispatch = useDispatch();
  const inputLabel = useRef(null);

  //My Code
  const AttributesData = useQuery(GET_ATTRIBUTES);
  const productData = useQuery(GET_PRODUCTS);

  const [attributeState, setAttributeState] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (AttributesData.data && AttributesData.data.productAttributes.data) {
      setAttributeState({
        attributes: AttributesData.data.productAttributes.data,
      });
    }
  }, [AttributesData.data]);

  useEffect(() => {
    if (productData.data && productData.data.products) {
      var selectedPro = productData.data.products.data;
      if (selectedPro && selectedPro.length) {
        setProducts(selectedPro);
      }
    }
  }, [productData.data]);
  //My Code End

  //   const attributeState = useSelector(state => state.productAttributes);

  //   const {products} = useSelector(state => state.products);

  const [labelWidth, setLabelWidth] = useState(0);
  const [currentVariants, setcurrentVariants] = useState({
    combinations: [],
    allValues: {},
  });
  const [currentAttribute, setcurrentAttribute] = useState({
    id: '',
    attribute_list: [],
  });

  const [loading, setLoading] = useState(false);
  const [variantImage, setVariantImage] = useState(null);

  useEffect(() => {
    onCombinationUpdate(currentVariants.combinations);
  }, [currentVariants.combinations]);

  //   useEffect(() => {
  //     dispatch(productsAction());
  //   }, []);

  //   useEffect(() => {
  //     setLabelWidth(inputLabel.current.offsetWidth);
  //     if (!isEmpty(attributeState)) {
  //       dispatch(attributesAction());
  //     }
  //   }, []);

  useEffect(() => {
    if (attributeState?.attributes?.length) {
      for (let i of attributeState.attributes) {
        for (let j of i.values) {
          currentVariants.allValues[j._id] = j.name;
        }
      }
    }
    if (product && attributeState?.attributes?.length) {
      let attrWithValue = {};
      for (const attr of product.attributes) {
        if (!Array.isArray(attrWithValue[attr.attribute_id])) {
          attrWithValue[attr.attribute_id] = [];
        }

        attrWithValue[attr.attribute_id].push(attr.attribute_value_id);
      }
      currentAttribute.attribute_list = [];
      for (let i in attrWithValue) {
        let values = [];
        let selected_values = [];

        for (let attr of attributeState.attributes) {
          if (i === attr.id) {
            for (let j of attr.values) {
              if (~attrWithValue[i].indexOf(j._id)) {
                selected_values.push(j._id);
              }
              values.push({value: j._id, label: j.name});
            }
            currentAttribute.attribute_list.push({
              id: attr.id,
              name: attr.name,
              isVariant: ~product.variant.indexOf(attr.id),
              selected_values: selected_values,
              values: values,
            });

            break;
          }
        }
      }
      let selected_variants = [];
      let allAttributes = [];

      for (const [key, attribute] of attributeState.attributes.entries()) {
        for (const value of attribute.values) {
          product.variation_master?.forEach(variation_master => {
            if (
              variation_master?.combinations.includes(value._id) &&
              !selected_variants.some(
                selected => selected.id === variation_master.id,
              )
            ) {
              selected_variants.push(variation_master);
            }
          });
        }
      }
      currentVariants.combinations = selected_variants;

      setcurrentAttribute({
        ...currentAttribute,
      });

      setcurrentVariants({
        ...currentVariants,
      });
      if (product?.variations) {
        setcurrentVariants({
          ...currentVariants,
          combinations: product?.variations,
        });
      }
    }
  }, [
    attributeState.attributes,
    product.variation_master,
    product?.attributes,
    product?.variations,
  ]);

  const changeSelectedValue = (e, i) => {
    currentAttribute.attribute_list[i].selected_values = e;
    setcurrentAttribute({
      ...currentAttribute,
    });

    createVariants();
  };

  const deleteAttribute = i => {
    console.log(i,JSON.stringify(currentAttribute.attribute_list))
    currentAttribute.attribute_list.splice(i, 1);
    setcurrentAttribute({
      ...currentAttribute,
    });
    saveAttribute();
  };
  // console.log(currentAttribute,' crtatt')
  const addAttribute = () => {
    
    if (!currentAttribute.id) {
      //   dispatch({
      //     type: ALERT_SUCCESS,
      //     payload: {
      //       boolean: false,
      //       message: 'Please Select The Correct Attribute',
      //       error: true,
      //     },
      //   });
      return;
    }

    let values = [];
    let name = '';
    for (let i of attributeState.attributes) {
      if (i.id === currentAttribute.id) {
        name = i.name;
        for (let j of i.values) {
          values.push({value: j._id, label: j.name});
        }
        break;
      }
    }

    let attribute_list = {
      id: currentAttribute.id,
      name: name,
      isVariant: true,
      selected_values: [],
      values: values,
    };

    currentAttribute.attribute_list.push(attribute_list);

    const idsToRemove = currentAttribute.attribute_list.map(attr => attr.id);
    const filteredAttributes = AttributesData.data.productAttributes.data.filter(attr => !idsToRemove.includes(attr.id));
    // const attr = attributeState?.attributes.filter(item=>item.id!=val)
    // console.log(JSON.stringify(filteredAttributes),idsToRemove,' datataat')
   

    currentAttribute.id = '';
    setcurrentAttribute({
      ...currentAttribute,
    });
    // setAttributeState({
    //   attributes:filteredAttributes
    // })
  };
  const saveAttribute = () => {
    // setLoading(true);
    product.attribute = [];
    product.variant = [];
    let isValidattribute = false;
    if (
      currentAttribute.attribute_list &&
      currentAttribute.attribute_list.length > 0
    ) {
      currentAttribute.attribute_list.forEach((attr, index) => {
        if (attr.selected_values.length > 0) {
          attr.selected_values.split(',').forEach(val => {
            product.attribute.push({
              attribute_id: attr.id,
              attribute_value_id: val, //Web Code Changes
            });
            product.attributes.push({
              attribute_id: attr.id,
              attribute_value_id: val, //Web Code Changes
            });
          });

          // if (attr.isVariant) {
          product.variant.push(attr.id);
          // }
          isValidattribute = true;
        } else {
          isValidattribute = false;
          //   dispatch({
          //     type: ALERT_SUCCESS,
          //     payload: {
          //       boolean: false,
          //       message: 'Attribute value is required',
          //       error: true,
          //     },
          //   });
        }
      });
    } else {
      isValidattribute = true;
    }
    if (isValidattribute) {
      productStateChange({
        ...product,
      });

      createVariants();
    } else {
      setLoading(false);
      //   dispatch({
      //     type: ALERT_SUCCESS,
      //     payload: {
      //       boolean: false,
      //       message: 'Attribute value is required',
      //       error: true,
      //     },
      //   });
    }
  };
  const createVariants = () => {
    let variants = {};
    for (const i of product.variant) {
      variants[i] = [];
    }
    if (product && product?.attribute && product?.attribute.length >= 0) {
      for (let attr of product.attribute) {
        if (variants.hasOwnProperty(attr.attribute_id)) {
          variants[attr.attribute_id].push(attr.attribute_value_id);
        }
      }
    }
    if (!Object.keys(variants).length) {
      setLoading(false);
      return;
    }

    variants = Object.values(variants);
    let combinations = allPossibleCases(variants);
    console.log(combinations, ' all comb1');
    let countMatch = [];
    let generatedVariants = [];
    combinations.forEach((comb, i) => {
      countMatch = [];
      currentVariants.combinations?.forEach((prevComb, j) => {
        countMatch[j] = 0;
        prevComb.combinations.forEach(v => {
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
          combinations: comb,
          productID: currentVariants?.combinations[index]?.productID,
        });

        currentVariants.combinations.splice(index, 1);
      } else {
        generatedVariants.push({
          combinations: comb,
          productID: '',
          sku: '',
          quantity: 0,
          pricing: {
            price: 0,
            sellprice: 0,
          },
          image: '',
        });
      }
    });
    currentVariants.combinations = generatedVariants;
    console.log(currentVariants.combinations, ' all comb2');
    setcurrentVariants({
      ...currentVariants,
    });
    setLoading(false);
  };
  const variantChange = (e, index) => {
    console.log(e, 'eeeesa');
    // if (e.target.name === 'image') {
    //   currentVariants.combinations[index]['upload_image'] = e.target.files;
    //   currentVariants.combinations[index]['previous_img'] =
    //     currentVariants.combinations[index].image;
    //   if (e?.target?.files?.length && e.target.files[0]) {
    //     currentVariants.combinations[index][e.target.name] =
    //       URL.createObjectURL(e.target.files[0]);
    //   }
    // } else {
    currentVariants.combinations[index][e.name] = e.value;
    // }
    setcurrentVariants({
      ...currentVariants,
    });
    onCombinationUpdate(currentVariants.combinations);
  };

  const variantDelete = i => {
    currentVariants.combinations.splice(i, 1);
    setcurrentVariants({
      ...currentVariants,
    });
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <>
          <View style={{paddingHorizontal: 15}}>
            <Text>Select Attribute</Text>
            <Multiselect
              inititalselect={currentAttribute.id}
              hmt={15}
              heading={''}
              height={35}
              fieldname={'attribute'}
              marginTop={10}
              ibw={1}
              inputBgColor={ThemeColor.whiteColor}
              // placeholderFont={FontStyle.fontRegular}
              data={attributeState?.attributes ?? []}
              onchange={(name, val) =>{
              //   console.log(attributeState?.attributes,' soloooo')
              //   if(attributeState?.attributes){
              //   const attr = attributeState?.attributes.filter(item=>item.id!=val)
              //   console.log(JSON.stringify(attr),val,' datataat')
              //   setAttributeState({
              //     attributes:attr
              //   })
              // }
                setcurrentAttribute({
                  ...currentAttribute,
                  id: val,
                })
              }
              }
              placeholder={'Select Attribute'}
              // ibbw={1}
              color="black"
              // borderBottomColor={'black'}
              padding={0}
              searchenabled={false}
              fs={15}
              paddingLeft={0}
              fontColr={'#707070'}
              vzindex={90}
            />
            <View style={{ marginTop: 15}} alignItems={'flex-end'} marginBottom={15}>
              <Button title="Add Attributes" onPress={addAttribute} />
            </View>
          </View>

          {currentAttribute.attribute_list.length > 0 ? (
            <>
              <View paddingHorizontal={15} title="Attributes" >
                {/* <View style={styles.infocontainer}> */}
                <View style={styles.info}>
                  <Text style={{fontWeight: 'bold'}}>Name</Text>
                  <Text style={{fontWeight: 'bold'}}>Value </Text>
                  <Text style={{fontWeight: 'bold'}}>Remove</Text>
                </View>

                {currentAttribute &&
                  currentAttribute?.attribute_list &&
                  currentAttribute.attribute_list.map((attribute, index) => (
                    <View style={styles.info} >
                      <Text style={{width: '20%',color:ThemeColor.blackColor}}>{attribute.name}</Text>
                      <View style={{width: '70%'}}>
                        {console.log(attribute.selected_values,'selected val attrivute')}
                        <Multiselect
                          valueSchema={'value'}
                          labelSchema={'label'}
                          inititalselect={attribute.selected_values}
                          // hmt={15}
                          heading={''}
                          // height={35}
                          fieldname={'attributeValues'}
                          // marginTop={10}
                          ibw={0}
                          inputBgColor="transparent"
                          data={attribute.values}
                          onchange={(name, e) => {
                            changeSelectedValue(e, index);
                          }}
                          placeholder={'Select Attribute Values'}
                          ibbw={0.9}
                          color="lightgray"
                          borderBottomColor={'#3C3C4360'}
                          padding={0}
                          searchenabled={false}
                          fs={15}
                          paddingLeft={0}
                          fontColr={'#707070'}
                          vzindex={21 + index}
                          mode="BADGE"
                          multiple={true}
                        />
                      </View>
                      <View style={{width: '10%'}}>
                        <AIcon
                          onPress={() => deleteAttribute(index)}
                          name="close"
                          size={20}
                          color={ThemeColor.blackColor}
                        />
                      </View>
                    </View>
                  ))}
                {/* </View> */}
              </View>

              <Divider />
              <View alignItems={'flex-end'} marginRight={15}  marginTop={20} zIndex={-1} marginBottom={15}>
                <Button
                  color="primary"
                  variant="contained"
                  onPress={saveAttribute}>
                  Save Attribute
                </Button>
              </View>
            </>
          ) : (
            ''
          )}
          {currentVariants.combinations &&
          currentVariants.combinations.length ? (
            <View paddingHorizontal={15} >
              {/* <View style={styles.infocontainer}> */}
              <View style={styles.info}>
                <Text style={{fontWeight: 'bold'}}>Variant</Text>
                <Text style={{fontWeight: 'bold'}}>Product</Text>
              </View>
              {currentVariants &&
                currentVariants?.combinations &&
                currentVariants.combinations.map((variant, index) => (
                  <View style={styles.info} >
                    <Text style={{width: '30%', color: 'black'}}>
                      {' '}
                      {variant.combinations
                        .map(val => currentVariants.allValues[val])
                        .join(' / ')}
                    </Text>
                    <View style={{width: '70%'}}>
                      <Multiselect
                        valueSchema={'_id'}
                        inititalselect={variant.productID}
                        hmt={15}
                        heading={''}
                        height={35}
                        fieldname={'productID'}
                        marginTop={10}
                        ibw={0}
                        inputBgColor="transparent"
                        data={products ?? []}
                        onchange={(name, e) =>
                          variantChange({name: name, value: e}, index)
                        }
                        placeholder={'Types'}
                        ibbw={0.9}
                        color="lightgray"
                        borderBottomColor={'#3C3C4360'}
                        padding={0}
                        searchenabled={true}
                        fs={15}
                        paddingLeft={0}
                        fontColr={'#707070'}
                        vzindex={21 + index}
                      />
                    </View>
                  </View>
                ))}
              {/* </View> */}
            </View>
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
};

const GroupAttributes = ({
  product,
  productStateChange,
  onCombinationUpdate,
  EditMode,
  setting,
}) => {
  return (
    <>
      <AttributesComponent
        product={product}
        productStateChange={productStateChange}
        onCombinationUpdate={onCombinationUpdate}
        EditMode={EditMode}
        setting={setting}
      />
    </>
  );
};
export default GroupAttributes;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha (4th parameter) for transparency
  },
  error: {
    position: 'absolute',
    width: '80%',
    backgroundColor: '#ff0000',
    zIndex: 10,
    bottom: 10,
    paddingVertical: 8,
    alignSelf: 'center',
    borderRadius: 10,
  },
  header: {
    width: '95%',
    // position: 'absolute',
    top: 0,
    alignSelf: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  info: {
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: ThemeColor.whiteColor,
  },
  license: {width: 100, height: 100, width: '50%', resizeMode: 'contain'},
  headerContent: {width: '33%'},
  infocontainer: {
    width: '100%',
    // elevation: 5,
    backgroundColor: 'white',
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  heading: {marginLeft: 30, marginTop: 15, fontSize: 16},

  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
