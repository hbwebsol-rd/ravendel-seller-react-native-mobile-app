import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Multiselect from '../components/multiselect';
import DropDownPicker from 'react-native-dropdown-picker';

const Test = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);

  const items = [
    {name: 'Item 1', id: 1},
    {name: 'Item 2', id: 2},
    {name: 'Item 3', id: 3},
    // Add more items as needed
  ];

  const toggleItemSelection = itemValue => {
    if (selectedItems.includes(itemValue)) {
      setSelectedItems(selectedItems.filter(value => value !== itemValue));
    } else {
      setSelectedItems([...selectedItems, itemValue]);
    }
  };

  const handleSpecialisationChange = (name, val) => {
    console.log(val, ' vvv');
    const numberArray = val ? val.split(',').map(Number) : [];
    setSelectedItems(numberArray);
  };

  console.log(selectedItems, 'ssi');
  return (
    <View style={{marginTop: 30}}>
      <Text>Select items:</Text>
      <Multiselect
        inititalselect={selectedItems}
        hmt={15}
        heading={''}
        height={35}
        fieldname={'type'}
        marginTop={10}
        ibw={0}
        inputBgColor="transparent"
        // placeholderFont={FontStyle.fontRegular}
        data={items}
        onchange={handleSpecialisationChange}
        placeholder={'Types'}
        ibbw={0.9}
        color="lightgray"
        borderBottomColor={'#3C3C4360'}
        padding={0}
        searchenabled={false}
        fs={15}
        paddingLeft={0}
        fontColr={'#707070'}
        vzindex={21}
        mode="BADGE"
        multiple={true}
      />

      <View
        style={{
          backgroundColor: '#171717',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
        }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          // setItems={setItems}

          theme="DARK"
          multiple={true}
          mode="BADGE"
          badgeDotColors={[
            '#e76f51',
            '#00b4d8',
            '#e9c46a',
            '#e76f51',
            '#8ac926',
            '#00b4d8',
            '#e9c46a',
          ]}
          schema={{
            label: 'name', // required
            value: 'id', // required
            // icon: () => <Icon name="up" size={12} color={'black'} />,
            parent: 'parent',
            selectable: 'selectable',
            disabled: 'disabled',
            testID: 'testID',
            containerStyle: 'containerStyle',
            labelStyle: 'labelStyle',
          }}
        />
      </View>
      {/* <Text>Selected Items: {selectedItems.join(', ')}</Text> */}
    </View>
  );
};

export default Test;
