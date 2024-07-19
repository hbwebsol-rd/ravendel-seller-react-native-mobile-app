import React, {useState} from 'react';
import {Input} from '@rneui/themed';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  HeaderOpenStyle,
  AccordionWrapper,
  AccordionHeader,
  AccordionTitle,
  AccordionBody,
} from '../components/accordion-styles';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const InventoryComponents = ({sku, quantity, onInventoryInputChange}) => {
  const [open, setOpen] = useState(true);

  const onAccordionChange = () => {
    setOpen(!open);
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={onAccordionChange}
        style={
          open
            ? styles.header
            : {
                ...styles.header,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderColor: '#ddd',
              }
        }>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryColor,
          }}>
          Inventory
        </Text>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          color={Colors.primaryColor}
          size={16}
        />
      </TouchableOpacity>
      <View
        style={{
          // paddingHorizontal : 7,
          display: open ? 'flex' : 'none',
          // height: open ? 'auto' : 0,
          paddingTop: open ? 10 : 0,
          paddingBottom: open ? 10 : 0,
          backgroundColor: '#f2f2f2',
        }}>
        <Input
          label="SKU"
          value={sku || ''}
          onChangeText={value => onInventoryInputChange('sku', value)}
        />
        <Input
          label="Quantity"
          keyboardType="numeric"
          type="number"
          value={quantity || ''}
          onChangeText={value => onInventoryInputChange('quantity', value)}
        />
      </View>
    </View>
  );

  return (
    <AccordionWrapper>
      <AccordionHeader
        onPress={onAccordionChange}
        style={open ? HeaderOpenStyle : {}}>
        <AccordionTitle>Inventory</AccordionTitle>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          color={Colors.primaryColor}
          size={16}
        />
      </AccordionHeader>
      <AccordionBody
        style={{
          height: open ? 'auto' : 0,
          paddingTop: open ? 15 : 0,
        }}>
        <Input
          label="SKU"
          value={sku || ''}
          onChangeText={value => onInventoryInputChange('sku', value)}
        />
        <Input
          label="Quantity"
          keyboardType="numeric"
          type="number"
          value={quantity || ''}
          onChangeText={value => onInventoryInputChange('quantity', value)}
        />
      </AccordionBody>
    </AccordionWrapper>
  );
};

export default InventoryComponents;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
