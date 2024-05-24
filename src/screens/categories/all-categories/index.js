import React from 'react';
import AllCategoriesView from './view';
import AppHeader from '../../components/header';
import FabBtn from '../../components/fab-btn';

const AllCategoriesScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Categories" navigation={navigation} />
      <AllCategoriesView navigation={navigation} />
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddCategory');
        }}
      />
    </>
  );
};

export default AllCategoriesScreen;
