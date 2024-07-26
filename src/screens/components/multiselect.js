import {Platform, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useMemo, useState, memo} from 'react';
// import {isEmpty} from '../../utils';
// import {
//   APP_PRIMARY_COLOR,
//   DARK_GREEN,
//   FontStyle,
//   LIGHT_GREEN,
// } from '../../utils/config';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
// import {AText} from '.';
import {isEmpty} from '../../utils/helper';
import ThemeColor from '../../utils/color';

const CustomMultiSelect = ({
  heading,
  placeholder,
  onchange,
  inititalselect,
  sideheadclick,
  sideheading,
  data,
  ibw,
  ibbw,
  fieldname,
  tmb,
  inputBgColor,
  height,
  br,
  color,
  icon,
  iconSize,
  iconColor,
  imr,
  searchenabled,
  multiple,
  fs,
  maxheight,
  elevation,
  direction,
  divheight,
  showtotal,
  mode,
  closedropdown,
  handledropdown,
  paddingLeft,
  paddingRight,
  marginTop,
  disable,
  reset,
  dropdownstyle,
  additionaldata,
  newval,
  allowempty,
  hmt,
  vzindex,
  borderColor,
  borderBottomColor,
  fontColr,
  placeholderFont,
  paddingLeftHeader,
  labelSchema,
  valueSchema,
  marHori,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(inititalselect);
  useEffect(() => {
    if (value !== null && value !== undefined && multiple) {
      onchange(fieldname, value.join(), additionaldata);
    } else if (value !== null && value !== undefined && !multiple) {
      onchange(fieldname, value);
    }
  }, [value]);
  useMemo(() => {
    setOpen(false), handledropdown !== undefined ? handledropdown() : null;
  }, [closedropdown]);

  useEffect(() => {
    if (inititalselect && !multiple) {
      setValue(inititalselect);
      onchange(fieldname, inititalselect);
    }
  }, [inititalselect]);
  //   useEffect(() => {
  //     setValue(inititalselect);
  //   }, [reset]);

  //   useEffect(() => {
  //     !isEmpty(newval) || (isEmpty(newval) && allowempty)
  //       ? setValue(newval)
  //       : null;
  //   }, [newval]);
  return (
    <View
      style={
        Platform.OS === 'ios'
          ? [{zIndex: vzindex || 20, marginHorizontal: marHori || 0}]
          : null
      }>
      <View>
        {!isEmpty(heading) && (
          <Text
            style={{
              color: 'gray',
              fontWeight: '400',
              marginTop: hmt ?? 20,
              paddingLeft: paddingLeftHeader ?? 0,
              //   marginBottom: 5,
            }}>
            {heading}
          </Text>
        )}
        {!isEmpty(sideheading) && (
          <TouchableWithoutFeedback
            onPress={() => {
              sideheadclick ? sideheadclick() : null;
            }}>
            <Text
              pr={paddingRight ?? 0}
              mt={marginTop ?? 0}
              bold
              right
              //   fonts={placeholderFont ?? FontStyle.fontMedium}
              color={'#156ABF'}
              xtrasmall
              lineThrough>
              {sideheading}
              {showtotal && value !== undefined && value !== null
                ? value.length + ' selected'
                : null}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
      <View
        style={{
          height: divheight ?? 'auto',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingLeft: paddingLeft ?? 0,
          paddingRight: paddingRight ?? 0,
          marginTop: marginTop ?? 0,
        }}>
        <DropDownPicker
          disabled={disable ?? false}
          open={open}
          value={value}
          items={data}
          setOpen={setOpen}
          setValue={setValue}
          // setItems={setItems}
          multiple={multiple}
          searchable={searchenabled}
          autoScroll={true}
          mode={!multiple ? 'SIMPLE' : 'BADGE'}
          placeholder={placeholder ?? 'Select'}
          dropDownMaxHeight={300}
          listMode={dropdownstyle ?? 'SCROLLVIEW'}
          showBadgeDot={true}
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          // badgeStyle={{
          //   height: 17,
          //   padding: 0,
          //   paddingLeft: 5,
          //   paddingRight: 5,
          //   paddingBottom: 0,
          //   paddingTop: 0,
          // }}
          // badgeDotColors={[ThemeColor.primaryColor]}
          // badgeTextStyle={{
          //   fontStyle: 'italic',
          //   fontSize: 8,
          //   color: ThemeColor.primaryColor,
          // }}
          // arrowIconStyle={{
          //   opacity: 0,
          // }}
          containerStyle={{
            flexWrap: 'wrap',
            minHeight: height ?? 30,
          }}
          style={{
            minHeight: height ?? 26,
            backgroundColor: inputBgColor ?? '#F5F5F5',
            borderRadius: br ?? 4,
            borderColor: borderColor ?? '#DCDCDC',
            borderWidth: ibw ?? 0.3,
            borderBottomWidth: ibbw ?? 0.3,
            borderBottomColor: borderBottomColor ?? '#dcdcdc',
            maxHeight: 30 ?? 26,
          }}
          placeholderStyle={{
            color: color ?? ThemeColor.grayColor,
            fontSize: 15,
          }}
          // listItemContainer={{
          //   height: 40,
          //   backgroundColor: 'pink',
          // }}
          textStyle={{
            fontSize: 12,
            fontWeight: '400',
            color: 'black',
          }}
          labelStyle={{
            fontSize: fs ?? 8,
            color: fontColr ?? ThemeColor.green,
            // fontFamily: FontStyle.fontMedium,
          }}
          listParentLabelStyle={
            {
              // backgroundColor: 'green',
            }
          }
          listItemLabelStyle={{
            paddingBottom: 8,
            borderBottomWidth: 0.5,
            borderBottomColor: '#bcbcbc',
          }}
          dropDownContainerStyle={{
            borderColor: '#ccc',
            backgroundColor: 'white',
            elevation: elevation,
            zIndex: 30000,
          }}
          searchContainerStyle={{
            borderBottomColor: '#dfdfdf',
          }}
          tickIconStyle={{
            borderColor: 'maroon',
          }}
          searchPlaceholder="Search..."
          schema={{
            label: labelSchema ?? 'name', // required
            value: valueSchema ?? 'id', // required
            // icon: () => <Icon name="up" size={12} color={'black'} />,
            parent: 'parent',
            selectable: 'selectable',
            disabled: 'disabled',
            testID: 'testID',
            containerStyle: 'containerStyle',
            labelStyle: 'labelStyle',
          }}
          dropDownDirection={direction ?? 'BOTTOM'}
          badgeDotColors={[
            '#e76f51',
            '#00b4d8',
            '#e9c46a',
            '#e76f51',
            '#8ac926',
            '#00b4d8',
            '#e9c46a',
          ]}
        />
        {icon ? (
          <Icon
            onPress={() => setOpen(old => !old)}
            style={{
              // top: top ?? 2,
              paddingRight: paddingRight ?? 0,
              marginRight: imr ?? 5,
              // position: 'absolute',
              right: 5,
              padding: 5,
              zIndex: 5000,
            }}
            name={icon}
            size={iconSize ?? 15}
            color={iconColor ?? 'black'}
          />
        ) : null}
      </View>
    </View>
  );
};

export default memo(CustomMultiSelect);
