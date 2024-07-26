import React from 'react';
import {Platform, View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Styles from '../common-styles';

const CustomPicker = ({
  iosDropdown,
  iosSelect,
  placeholder,
  selectedValue,
  androidPickerData,
  iosPickerData,
  pickerValChange,
  pickerKey,
  pickerVal,
  label,
  otherWrapperStyle,
  getNullval,
  onDonePress,
  noPlaceholder,
}) => {
  return (
    <>
      {Platform.OS === 'ios' && iosDropdown ? null : null}
      {Platform.OS === 'ios' && iosSelect ? null : null}

      {/* {Platform.OS === 'android' ? ( */}
        <View style={[Styles.pickerWrapper, otherWrapperStyle]}>
          <Text style={Styles.pickerLabel}>{label}</Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue === null) {
                if (getNullval) {
                  pickerValChange('');
                }
                return;
              }
              pickerValChange(itemValue);
            }}>
            <Picker.Item
              value={null}
              label={placeholder}
              color="rgba(0,0,0,0.5)"
            />

            {androidPickerData
              ? androidPickerData.map((data, index) => (
                  <Picker.Item
                    key={index}
                    label={data[pickerKey]}
                    value={data[pickerVal]}
                  />
                ))
              : null}
          </Picker>
        </View>
      {/* ) : null} */}
    </>
  );
};

export default CustomPicker;
