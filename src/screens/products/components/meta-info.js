import React, {useState} from 'react';
import {Input} from '@rneui/themed';
import Colors from '../../../utils/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const MetaInfoComponents = ({meta, onMetaInputChange}) => {
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
          Meta Information
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
      </View>
    </View>
  );
};

export default MetaInfoComponents;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
