import React, {useEffect, useState} from 'react';
import EditCategoryView from './view';
import AppHeader from '../../components/header';

const EditCategoryScreen = ({navigation, route}) => {
  const [singleCategoryDetail, setSingleCategoryDetail] = useState({});
  useEffect(() => {
    if (route.params && route.params.singleCategory) {
      setSingleCategoryDetail(route.params.singleCategory);
    }
  }, [route.params]);

  return (
    <>
      <AppHeader title="Edit Category" navigation={navigation} back />
      <EditCategoryView
        singleCategoryDetail={singleCategoryDetail}
        navigation={navigation}
      />
    </>
  );
};

export default EditCategoryScreen;
