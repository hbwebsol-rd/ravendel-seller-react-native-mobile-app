import React, {useState, useEffect} from 'react';
import {Grid, Box, FormControlLabel, Checkbox, Collapse} from '@mui/material';
import {CheckBox} from '@rneui/themed';
// import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
// import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
// import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
// import {useSelector, useDispatch} from 'react-redux';
// import {unflatten} from '../../../utils/helper';
// import {categoriesAction} from '../../../store/action';
import _, {indexOf} from 'lodash';
import {unflatten} from '../../utils/helper';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import ThemeColor from '../../utils/color';

const EditCategoriesComponent = ({
  data,
  onCategoryChange,
  selectedCategoriesTree,
  selectedCategories,
}) => {
  // const dispatch = useDispatch();
  // const products = useSelector(state => state.products);
  const [catList, setCatList] = useState([]);
  const [collapseCategory, setcollapseCategory] = useState({});

  // useEffect(() => {
  //   dispatch(categoriesAction());
  // }, []);
  const updateCategoryData = (categoriesData, selectedCategoyTree) => {
    categoriesData.forEach(category => {
      const matchingCategory = selectedCategoyTree?.find(cat => {
        return cat.id === category.id;
      });
      if (matchingCategory) {
        if (matchingCategory.checked) {
          category.checked = true;
          updateChildCheckedStatus(category, category?.checked);
        }

        if (!matchingCategory?.checked && category.children) {
          updateCategoryData(category.children, matchingCategory.children);
        }
      }
    });
  };

  useEffect(() => {
    if (data) {
      var selectedCat = JSON.parse(JSON.stringify(data));
      selectedCat?.map(cat => {
        cat.checked = false;
      });
      let cat = unflatten(selectedCat);
      // console.log(cat, '-----------cat');
      updateCategoryData(cat, selectedCategoriesTree);
      setCatList(cat);
    }
  }, [data, selectedCategories, selectedCategoriesTree]);
  //
  const collapseToggle = category => {
    category.open = !category.open;
    setcollapseCategory({...collapseCategory, [category.id]: category.open});
  };
  const updateParentChecked = category => {
    // Check if the category has children
    if (category?.children && category?.children.length > 0) {
      let allChildrenChecked = true;
      let anyChildUnchecked = false;

      // Recursively check each child category
      category?.children.forEach(child => {
        updateParentChecked(child);

        // Update the flag based on child's checked status
        if (!child.checked) {
          anyChildUnchecked = true;
        } else {
          if (hasCheckedChild(child)) {
            allChildrenChecked = true;
          } else {
            allChildrenChecked = false;
          }
        }
      });
      // Update the parent's checked status based on children's status
      if (allChildrenChecked) {
        category.checked = true;
      }
      if (anyChildUnchecked) {
        category.checked = false;
      }
    }
  };
  const hasCheckedChild = cat => {
    if (cat.checked) {
      return true;
    }
    if (cat?.children && Array.isArray(cat.children)) {
      for (const child of cat.children) {
        if (hasCheckedChild(child)) {
          return true;
        }
      }
    }
    return false;
  };
  const updateChildCheckedStatus = (category, isChecked) => {
    // Check if the category has children
    if (category?.children && category?.children?.length > 0) {
      if (isChecked) {
        category.checked = true;
      } else {
        category.checked = false;
      }

      // Recursively update each child category
      category?.children?.forEach(child => {
        updateChildCheckedStatus(child, category?.checked);
      });
    } else {
      // If the category has no children, update its checked status based on selectParent
      category.checked = isChecked;
    }
  };
  const findAndUpdateCategory = (categories, categoryId, checkedStatus) => {
    for (let category of categories) {
      if (category.id === categoryId) {
        updateChildCheckedStatus(category, checkedStatus);
        updateParentChecked(category, checkedStatus);
        return category; // Return the updated category
      } else if (category.children && category.children.length > 0) {
        const updatedChild = findAndUpdateCategory(
          category.children,
          categoryId,
          checkedStatus,
        );
        if (updatedChild) {
          // Update the parent category with the updated child
          updateParentChecked(category, checkedStatus);
          return category;
        }
      }
    }
    return null;
  };

  const handleCategoryCheckbox = category => {
    category.checked = !category.checked;
    const updatedCategory1 = findAndUpdateCategory(
      catList,
      category.id,
      category.checked,
    );
    let updatedList = catList.map(cat =>
      cat.id === updatedCategory1.id ? updatedCategory1 : cat,
    );
    setCatList(updatedList);
    let selectedCategory = updatedList
      ?.filter(item => hasCheckedChild(item))
      ?.map(({open, ...rest}) => rest);

    onCategoryChange(selectedCategory);
  };

  const checkedChildernChecked = cat => {
    var checked = hasCheckedChild(cat);
    if (!cat.checked) {
      if (checked) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // console.log(JSON.stringify(catList), ' categg');
  const menuListing = categories => {
    return categories.map((cat, index) => {
      if (!cat?.children?.length) {
        return (
          <View
            marginLeft={cat.parentId ? 20 : 0}
            style={{flexDirection: 'row'}}
            container
            alignItems="center"
            key={cat.name}>
            <View item>
              <View mr={2}>
                <FIcon name="circle" size={20} color={'gray'} />
              </View>
            </View>
            <View item>
              <CheckBox
                title={cat.name}
                checked={cat.checked}
                onPress={e => handleCategoryCheckbox(cat)}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={cat.checked}
                    name="categoryIds"
                    onChange={e => handleCategoryCheckbox(cat)}
                    value={cat.id}
                  />
                }
                label={cat.name}
              /> */}
            </View>
          </View>
        );
      }
      return (
        <View key={cat.name}>
          <View
            marginLeft={cat.parentId ? 20 : 0}
            flexDirection="row"
            container
            alignItems="center"
            className="category-dropdown">
            <View item>
              <View mr={2}>
                <TouchableOpacity
                  className="toggle-icon"
                  onPress={() => {
                    console.log('ddd');
                    collapseToggle(cat);
                  }}>
                  {collapseCategory[cat.id] ? (
                    <AIcon name="minuscircle" size={20} color={'#000'} />
                  ) : (
                    // <RemoveCircleRoundedIcon
                    //   style={{fontSize: 22}}
                    //   className="expand-right"
                    // />
                    <AIcon name="pluscircle" size={20} color={'#000'} />

                    // <AddCircleRoundedIcon
                    //   style={{fontSize: 22}}
                    //   className="expand-right"
                    // />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View item>
              <CheckBox
                title={cat.name}
                checked={cat.checked}
                onPress={e => handleCategoryCheckbox(cat)}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
              />
              {/* <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={cat.checked}
                    name="categoryIds"
                    onChange={e => handleCategoryCheckbox(cat)}
                    value={cat.id}
                    indeterminate={checkedChildernChecked(cat)}
                  />
                }
                label={cat.name}
              /> */}
            </View>
          </View>
          <View ml={4}>
            {collapseCategory[cat.id] ? <>{menuListing(cat.children)}</> : ''}
            {/* <Collapse
              in={collapseCategory[cat.id]}
              timeout="auto"
              unmountOnExit
              className="submenu-sidebar"> */}
            {/* </Collapse> */}
          </View>
        </View>
      );
    });
  };
  return (
    <>
      {catList && catList.length ? (
        <View
          style={{
            backgroundColor: ThemeColor.whiteColor,
            paddingHorizontal: 15,
            paddingTop: 10,
          }}>
          <Text style={styles.title}>Categories</Text>
          {menuListing(catList)}
        </View>
      ) : null}
    </>
  );
};

export default EditCategoriesComponent;
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: ThemeColor.primaryColor,
  },
});
