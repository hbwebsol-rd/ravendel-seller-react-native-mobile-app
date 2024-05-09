import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ThemeColor from '../../../utils/color';

const Specification = ({data, groups, setGroups}) => {
  const handleGroupNameChange = (text, index) => {
    const updatedGroups = [...groups];
    updatedGroups[index].name = text;
    setGroups(updatedGroups);
  };
  const handleKeyChange = (text, groupIndex, attributeIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].attributes[attributeIndex].key = text;
    updatedGroups[groupIndex].attributes[attributeIndex].keyId = data
      .filter(item => item.name === text)
      .map(item => item.id)[0];
    setGroups(updatedGroups);
  };
  const handleValueChange = (value, groupIndex, attributeIndex, keyname) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].attributes[attributeIndex].value = value;
    updatedGroups[groupIndex].attributes[attributeIndex].valueId = data
      .filter(item => item.name === keyname)[0]
      .values.filter(item => item.name === value)
      .map(item => item._id)[0];
    setGroups(updatedGroups);
  };

  const handleAddGroup = () => {
    setGroups([...groups, {name: '', attributes: [{key: '', value: ''}]}]);
  };

  const handleAddAttribute = groupIndex => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].attributes.push({
      key: '',
      value: '',
      keyId: '',
      valueId: '',
    });
    setGroups(updatedGroups);
  };

  return (
    <View>
      {groups.map((group, groupIndex) => (
        <View key={groupIndex}>
          <TextInput
            style={{
              paddingLeft: 15,
              borderBottomWidth: 0.5,
              borderColor: ThemeColor.gray,
              borderColor: ThemeColor.blackColor,
              fontSize: 16,
            }}
            placeholder="Specification Name"
            value={group.name}
            onChangeText={text => handleGroupNameChange(text, groupIndex)}
          />
          {group.attributes.map((attribute, attributeIndex) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // width: '100%',
                // backgroundColor: 'orange',
              }}
              key={attributeIndex}>
              <Picker
                style={{width: '49%'}}
                selectedValue={attribute.key}
                onValueChange={itemValue =>
                  handleKeyChange(itemValue, groupIndex, attributeIndex)
                }>
                <Picker.Item label="Select Key" value="" />
                {data.map(value => (
                  <Picker.Item
                    key={value._id}
                    label={value.name}
                    value={value.name}
                  />
                ))}
              </Picker>
              <Picker
                style={{width: '49%'}}
                selectedValue={attribute.value}
                onValueChange={valueName =>
                  handleValueChange(
                    valueName,
                    groupIndex,
                    attributeIndex,
                    groups[groupIndex]?.attributes[attributeIndex]?.key,
                  )
                }>
                <Picker.Item label="Select Value" value="" />

                {groups[groupIndex]?.attributes[attributeIndex]?.key ? (
                  data
                    .filter(
                      item =>
                        item.name ===
                        groups[groupIndex]?.attributes[attributeIndex]?.key,
                    )
                    .map(item => item.values)[0]
                    .map(value => (
                      <Picker.Item
                        key={value._id}
                        label={value.name}
                        value={value.name}
                      />
                    ))
                ) : (
                  <Picker.Item key={''} label={''} value={''} />
                )}
              </Picker>
            </View>
          ))}
          <TouchableOpacity
            style={{...style.btnStyle, backgroundColor: ThemeColor.blue}}
            onPress={() => handleAddAttribute(groupIndex)}>
            <Text style={{color: ThemeColor.whiteColor}}>Add Attribute</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={style.btnStyle} onPress={handleAddGroup}>
        <Text style={{color: ThemeColor.whiteColor}}>Add Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Specification;

const style = StyleSheet.create({
  btnStyle: {
    marginTop: 15,
    backgroundColor: ThemeColor.grayColor,
    width: 100,
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
  },
});
