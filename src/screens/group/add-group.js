import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AppHeader from '../components/header';
import {useMutation, useQuery} from '@apollo/client';
import {GET_ATTRIBUTES} from '../../queries/attributesQueries';
import Attributes from '../products/components/attributesold';
import {GET_PRODUCTS} from '../../queries/productQueries';
import FormActionsComponent from '../components/formAction';
import {Input} from '@rneui/themed';
import {
  ADD_GROUP_PRODUCT,
  GET_GROUP_PRODUCT,
  UPDATE_GROUP_PRODUCT,
} from '../../queries/groupProductQueries';
import GroupAttributes from '../components/group-attributes';
import {isEmpty} from '../../utils/helper';
import _ from 'lodash';
import {GraphqlError, GraphqlSuccess} from '../components/garphqlMessages';

const AddGroupScreen = ({navigation, route}) => {
  const [combination, setCombination] = useState([]);
  const id = route?.params?.id;
  console.log(id, 'iddd');
  const [addGroup, {loading: addedLoading}] = useMutation(ADD_GROUP_PRODUCT, {
    onError: error => {
      console.log(error);
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data, ' daaa');
      if (data.addGroup.success) {
        GraphqlSuccess('Added successfully');
        setGroupProduct({
          title: '',
          attributes: [],
          variant: [],
        });
        navigation.goBack();
      } else {
        GraphqlError(data.addGroup.message);
      }
    },
  });
  const [updateGroup, {loading: updateLoading}] = useMutation(
    UPDATE_GROUP_PRODUCT,
    {
      onError: error => {
        GraphqlError(error);
      },
      onCompleted: data => {
        console.log(data, ' daaa');
        GraphqlSuccess('Updated successfully');
        setGroupProduct({
          title: '',
          attributes: [],
          variant: [],
        });
        navigation.goBack();
      },
    },
  );
  const groupProductState = useQuery(GET_GROUP_PRODUCT, {
    variables: {groupId: id},
  });
  const [groupProduct, setGroupProduct] = useState({
    title: '',
    attributes: [],
    variant: [],
  });

  function groupAttributes(attributes) {
    const groupedAttributes = {};

    attributes.forEach(attribute => {
      if (!groupedAttributes[attribute.attribute_id]) {
        groupedAttributes[attribute.attribute_id] = {
          _id: attribute.attribute_id,
          values: [],
        };
      }
      groupedAttributes[attribute.attribute_id].values.push(
        attribute.attribute_value_id,
      );
    });

    return Object.values(groupedAttributes);
  }

  function getVariants(combinations, groupedAttributes, editingId) {
    // Here we want the combination array of ids to convert in array of objects {attributeID: '', attributeValue: ''}
    const variants = combinations.map(combination => {
      const obj = {
        productId: combination?.productID,
        combinations:
          !!combination?.combinations &&
          combination?.combinations.map(combId => ({
            attributeId: groupedAttributes.find(attri =>
              attri?.values?.some(id => id === combId),
            )?._id,
            attributeValueId: combId,
          })),
      };

      return obj;
    });
    return variants;
  }

  const addProduct = () => {
    // e.preventDefault();
    // groupProduct.taxClass = taxClass;
    // groupProduct.shipping.shippingClass = shippingClass;
    // let errors = validate(["short_description", "quantity", "sku", 'categoryId', "description", "title"], groupProduct);

    // let errors = validate(['title'], groupProduct);
    if (false && !isEmpty(errors)) {
      dispatch({
        type: ALERT_SUCCESS,
        payload: {
          boolean: false,
          message: errors,
          error: true,
        },
      });
    } else {
      // product.combinations = combination;
      let variations = [];
      let attributes = [];
      if (id && attributes?.length <= 0 && variations?.length <= 0) {
        if (groupProduct?.attributes && !!groupProduct?.attributes?.length) {
          const groupedAttributes = groupAttributes(groupProduct.attributes);
          // groupProduct.attributes = groupedAttributes;
          if (groupedAttributes && !!groupAttributes?.length) {
            const variants = getVariants(combination, groupedAttributes, id);
            attributes = groupedAttributes;
            variations = variants;
            // if(variants){
            //   groupProduct.variations = variants;
            // }
            setGroupProduct({
              ...groupProduct,
              // variations: variants,
              // attributes: groupedAttributes
            });
          }
        }
      } else {
        if (groupProduct?.attribute && !!groupProduct?.attribute?.length) {
          const groupedAttributes = groupAttributes(groupProduct.attribute);
          // groupProduct.attributes = groupedAttributes;
          if (groupedAttributes && !!groupAttributes?.length) {
            const variants = getVariants(combination, groupedAttributes);
            attributes = groupedAttributes;
            variations = variants;
            // if(variants){
            //   groupProduct.variations = variants;
            // }
            setGroupProduct({
              ...groupProduct,
              // variations: variants,
              // attributes: groupedAttributes
            });
          }
        }
      }
      const obj = {
        title: groupProduct?.title,
        attributes:
          id && attributes?.length <= 0 ? groupProduct?.attributes : attributes,
        variations:
          id && variations?.length <= 0 ? groupProduct?.variations : variations,
        productIds: variations?.map(variation => variation?.productId),
      };
      console.log(JSON.stringify(obj), ' final form');
      if (id) {
        updateGroup({
          variables: {...obj, updateGroupId: id},
        });
        // dispatch(
        //   groupProductUpdateAction({...obj, updateGroupId: id}, navigate),
        // );
      } else {
        addGroup({
          variables: obj,
        });
        // dispatch(groupProductAddAction(obj, navigate));
      }
    }
  };

  useEffect(() => {
    console.log(groupProductState.data, ' ddd');
  }, [groupProductState]);

  useEffect(() => {
    if (id && !isEmpty(_.get(groupProductState, 'data.group.data'))) {
      const convertedAttributes = [];
      let convertedVariations = [];
      if (_.get(groupProductState, 'data.group.data.attributes')) {
        groupProductState.data.group.data.attributes?.forEach(item => {
          item.values.forEach(value => {
            convertedAttributes.push({
              attribute_id: item._id,
              attribute_value_id: value,
            });
          });
        });
      }
      if (_.get(groupProductState, 'data.group.data.variations')) {
        //   const convertedArray = groupProductState.groupProduct.variations.map(item => {
        //     return {
        //         productId: item.productId,
        //         combinations: item.combinations.map(combination => ({
        //             attributeId: combination.attributeId,
        //             attributeValueId: combination.attributeValueId
        //         }))
        //     };
        // });
        const convertedArray = groupProductState.data.group.data.variations.map(
          item => {
            return {
              productID: item.productId,
              combinations: item.combinations.map(
                combination => combination.attributeValueId,
              ),
            };
          },
        );
        convertedVariations = convertedArray;
      }
      // const productVariants = ['65cb2b0ca9dfee40f95226ff', '65cb2b2ba9dfee40f9522716'];
      setGroupProduct({
        ...groupProduct,
        attributes: convertedAttributes,
        variations: convertedVariations,
        // attributes:  get(groupProductState, 'groupProduct.attributes', []),
        title: _.get(groupProductState, 'data.group.data.title'),
        // variant: productVariants
      });
    }
  }, [groupProductState, id]);
  return (
    <ScrollView style={{...styles.container}}>
      <AppHeader title="Add Group Product" navigation={navigation} />
      <FormActionsComponent
        onCancel={() => navigation.goBack()}
        onSubmit={addProduct}
        submitText={id ? 'Update' : 'Add'}
      />
      <Input
        label="Name"
        value={groupProduct.title}
        onChangeText={value =>
          setGroupProduct({...groupProduct, ['title']: value})
        }
        // errorMessage={validation.title}
      />
      <GroupAttributes
        product={groupProduct}
        productStateChange={({...groupProduct}) =>
          setGroupProduct({
            ...groupProduct,
          })
        }
        onCombinationUpdate={combination => {
          setCombination(combination);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddGroupScreen;
