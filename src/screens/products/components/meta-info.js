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

const MetaInfoComponents = ({meta, onMetaInputChange}) => {
  const [open, setOpen] = useState(true);

  const onAccordionChange = () => {
    setOpen(!open);
  };

  return (
    <AccordionWrapper>
      <AccordionHeader
        onPress={onAccordionChange}
        style={open ? HeaderOpenStyle : {}}>
        <AccordionTitle>Meta Information</AccordionTitle>
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
          label="Meta Title"
          value={meta.title || ''}
          onChangeText={value => onMetaInputChange('title', value)}
        />
        <Input
          label="Meta Keyword"
          value={meta.keywords || ''}
          onChangeText={value => onMetaInputChange('keywords', value)}
        />
        <Input
          label="Meta Description"
          value={meta.description || ''}
          onChangeText={value => onMetaInputChange('description', value)}
          multiline
          numberOfLines={2}
        />
      </AccordionBody>
    </AccordionWrapper>
  );
};

export default MetaInfoComponents;
