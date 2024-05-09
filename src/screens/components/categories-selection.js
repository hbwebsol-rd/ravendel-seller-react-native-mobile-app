import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {CheckBox, Overlay, Button} from '@rneui/themed';
import Accordion from './accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/color';

const CategoriesSelections = ({data, selectedItems, onCategoryChange}) => {
  const [selected, setSelected] = useState(selectedItems);
  const [visible, setVisible] = useState(false);

  useMemo(() => {
    setSelected(selectedItems);
  }, [selectedItems]);

  const categoriesListing = categories => {
    return categories.map((category, i) =>
      category.children && category.children.length > 0 ? (
        <Accordion
          title={
            <CheckBox
              title={category.name}
              checked={selected.some(e => e.id === category.id)}
              onPress={() => {
                onCategoryHandle(category);
              }}
              containerStyle={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
            />
          }
          key={i}
          dense
          withCheckbox>
          {categoriesListing(category.children)}
        </Accordion>
      ) : (
        <View key={i}>
          <CheckBox
            title={category.name}
            checked={selected.some(e => e.id === category.id)}
            onPress={() => {
              onCategoryHandle(category);
            }}
          />
        </View>
      ),
    );
  };

  const onCategoryHandle = category => {
    var hasItem = selected.some(item => item.id === category.id);
    if (hasItem) {
      var items = selected.filter(item => item.id !== category.id);
      onCategoryChange(items);
      setSelected(items);
    } else {
      selected.push(category);
      setSelected([...selected]);
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const unSelectCat = category => {
    onCategoryHandle(category);
  };

  useEffect(() => {
    onCategoryChange(selected);
  }, [selected]);

  const selectedCategoryShow = () => {
    return (
      <View style={styles.selectedCategoriesWrapper}>
        {selected.map((cat, i) => (
          <View style={styles.badgeWrapper} key={i}>
            <Text style={styles.selectedCatName}>{cat.name}</Text>
            <Icon
              name="close"
              color="#000"
              size={14}
              onPress={() => unSelectCat(cat)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      {data.length ? (
        <View style={styles.categoriesWrapper}>
          <Text style={styles.title}>Categories</Text>
          {/* ============Selected Categories Show================ */}
          {selected && selected.length ? selectedCategoryShow() : null}

          {/* ============Add New Category ================ */}
          <TouchableOpacity
            style={styles.addNewCatWrapper}
            onPress={toggleOverlay}>
            <Icon name="plus" color="#000" size={14} style={styles.addIcon} />
            <Text>Add New</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* ============Categories selection modal================ */}
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen>
        <>
          <ScrollView style={{flex: 1}}>
            <Text style={styles.title}>Categories </Text>
            {/* ============Selected Categories Show================ */}
            {selected && selected.length ? selectedCategoryShow() : null}
            {categoriesListing(data)}
          </ScrollView>
          <Button title="Confirm" onPress={toggleOverlay} />
        </>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  categoriesWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  badgeWrapper: {
    // paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    flexDirection: 'row',
    margin: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  selectedCatName: {
    marginRight: 10,
  },
  selectedCategoriesWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  addNewCatWrapper: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: Colors.primaryColor,
  },
  addIcon: {
    marginRight: 10,
  },
});

export default CategoriesSelections;
