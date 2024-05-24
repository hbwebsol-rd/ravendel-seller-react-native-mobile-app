import React, {useState, useEffect} from 'react';
import AppHeader from '../../components/header';
import AllProductsView from './view';
import FabBtn from '../../components/fab-btn';
import {useIsFocused} from '@react-navigation/native';

const AllProductsScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  var RefecthAllProducts = route.params && route.params.reload ? true : false;
  const [relaod, setReload] = useState(false);
  useEffect(() => {
    if (isFocused) {
      setReload(RefecthAllProducts);
    }
  }, [RefecthAllProducts, isFocused]);

  return (
    <>
      <AppHeader title="Products" navigation={navigation} />
      <AllProductsView
        navigation={navigation}
        RefecthAllProducts={relaod}
        stopReload={() => setReload(false)}
      />
      <FabBtn
        onPressFunc={() => {
          navigation.navigate('AddProduct');
        }}
      />
    </>
  );
};

export default AllProductsScreen;
