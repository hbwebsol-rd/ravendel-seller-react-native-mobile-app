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

const InventoryComponents = ({sku, quantity, onInventoryInputChange}) => {
  const [open, setOpen] = useState(true);

  const onAccordionChange = () => {
    setOpen(!open);
  };

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
