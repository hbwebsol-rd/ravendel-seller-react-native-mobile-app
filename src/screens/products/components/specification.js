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
import Icon from 'react-native-vector-icons/AntDesign';

const Specification = ({
  data,
  groups,
  setGroups,
  removeItemFromGroup,
  removeValueAtIndex,
}) => {
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

  // return <View />;
  return (
    <View>
      {groups &&
        groups.map((group, groupIndex) => (
          <View key={groupIndex}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: '95%'}}>
                <TextInput
                  style={{
                    paddingLeft: 15,
                    borderBottomWidth: 0.5,
                    borderColor: ThemeColor.gray,
                    borderColor: ThemeColor.blackColor,
                    fontSize: 16,
                    color: ThemeColor.blackColor,
                  }}
                  placeholder="Specification Name"
                  value={group.name}
                  onChangeText={text => handleGroupNameChange(text, groupIndex)}
                />
              </View>
              <Icon
                style={{width: '5%'}}
                name="close"
                color={ThemeColor.redColor}
                size={15}
                onPress={() => removeItemFromGroup(groupIndex)}
              />
            </View>
            {group.attributes.map((attribute, attributeIndex) => (
              <View
                style={{
                  justifyContent: 'space-between',
                  borderWidth: 0.5,
                  borderColor: ThemeColor.gray,
                  marginTop: 5,
                  flexDirection: 'row',
                }}
                key={attributeIndex}>
                <View style={{width: '95%'}}>
                  <Picker
                    style={{width: '100%', color: ThemeColor.blackColor}}
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
                    style={{width: '100%', color: ThemeColor.blackColor}}
                    selectedValue={attribute.value}
                    onValueChange={valueName =>
                      handleValueChange(
                        valueName,
                        groupIndex,
                        attributeIndex,
                        groups[groupIndex]?.attributes[attributeIndex]?.key,
                      )
                    }>
                    {groups[groupIndex]?.attributes[attributeIndex]?.key ? (
                      <Picker.Item label="Select Value" value="" />
                    ) : null}

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
                      <Picker.Item key={''} label={'Select Value'} value={''} />
                    )}
                  </Picker>
                </View>
                <Icon
                  name="close"
                  color={ThemeColor.redColor}
                  onPress={() => removeValueAtIndex(groupIndex, attributeIndex)}
                  size={16}
                />
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
