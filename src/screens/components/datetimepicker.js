import moment from 'moment';
import React, {useState, useRef} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
// import {AButton, AText} from '.';
import {isEmpty} from '../../utils/helper';
import {Button} from 'react-native';
import ThemeColor from '../../utils/color';

const CustomDatePicker = ({
  onClose,
  onChange,
  date,
  mindate,
  selectedValue,
  placeholder,
  pickerStyle,
  SelectedValueStyle,
  answer,
  phc,
  vc,
  mode,
  heading,
  hc,
  fieldname,
  fs,
  maxdate,
}) => {
  const [Datestate, setDatestate] = useState(
    isEmpty(answer.toString()) ? new Date() : answer,
  );

  const [datea, setDatea] = useState(
    mode === 'time' && !isEmpty(answer.toString())
      ? moment(answer).format('LT')
      : mode === 'date' && !isEmpty(answer.toString())
      ? moment(answer).format('L')
      : null,
  );

  const refRBSheet = useRef();
  const handleConfirm = selectedDate => {
    // console.log(selectedDate, 'seld');
    setDatestate(selectedDate);
    // refRBSheet.current.close();
    if (onChange) {
      onChange(fieldname, selectedDate);
      if (mode === 'time') {
        setDatea(moment(selectedDate).format('LT'));
      } else {
        setDatea(moment(selectedDate).format('L'));
      }
    }
  };

  const handleCancel = () => {
    refRBSheet.current.close();
  };
  return (
    <>
      {heading ? (
        <Text color={hc} marginTop="10px" marginBottom="5px">
          {heading}
        </Text>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[pickerStyle]}
        onPress={() => {
          refRBSheet.current.open();
        }}>
        <Text
          numberOfLines={1}
          style={[
            {
              marginLeft: 5,
              letterSpacing: Platform.OS === 'ios' ? 0 : -1,
              includeFontPadding: false,
              color: !isEmpty(datea) ? vc : phc,
              fontSize: fs ?? 16,
            },
            SelectedValueStyle,
          ]}>
          {!isEmpty(datea) ? datea : placeholder}
        </Text>
        {/* <Icon style={{zIndex: 10}} name="caretdown" size={15} color="gray" /> */}
      </TouchableOpacity>

      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        closeOnDragDown={true}
        onClose={onClose}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <DatePicker
            textColor="black"
            mode={mode ?? 'date'}
            date={Datestate}
            onDateChange={handleConfirm}
            minimumDate={mindate}
            maximumDate={maxdate ?? null}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
              width: '40%',
            }}>
            <TouchableOpacity
              style={styles.btnStyle}
              title={'SUBMIT'}
              onPress={handleCancel}>
              <Text style={{color: ThemeColor.whiteColor}}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default CustomDatePicker;
const styles = StyleSheet.create({
  btnStyle: {
    width: '45%',
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: ThemeColor.primaryColor,
  },
});
