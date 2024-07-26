import React, {useEffect, useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SettingScreen,
  ProfileScreen,
  ForgotPasswordScreen,
  LoginScreen,
  DashboardScreen,
  ConfirmScreen,
  AllGroupsScreen,
  AllProductsScreen,
  AddProductsScreen,
  EditProductsScreen,
  AllAttributesScreen,
  EditAttributeScreen,
  AddAttributeScreen,
  AllCategoriesScreen,
  EditCategoryScreen,
  AddCategoryScreen,
  AllBrandsScreen,
  EditBrandScreen,
  AddBrandScreen,
  EditGroupsScreen,
  AddGroupsScreen,
  AllCouponsScreen,
  EditCouponsScreen,
  AddCouponsScreen,
  AllOrdersScreen,
  ViewOrderScreen,
  AllCustomerScreen,
  ViewCustomerScreen,
} from '../screens';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {CustomDrawer} from '../screens/components/custom-drawer';
import CustomersScreen from './customer-screens';
import OrdersScreen from './order-screens';
import CouponScreens from './copoun-screens';
import ProductsScreen from './product-screens';
import CategoriesScreens from './category-screens';
import BrandsScreens from './brands-screens';
import AttrbutesScreen from './attributes-screen';
import GroupScreen from './group-screen';
import {Context as AuthContext} from '../context/AuthContext';
import {isEmpty} from '../utils/helper';
// import InternetConnectivity from '../screens/components/internet-connectivity';
import SplashScreen from '../screens/components/splash-screen';
import {setToken} from '../utils/api';
import Test from '../screens/dashboard/test';
import {AppSettingAction} from '../store/action/dashboardAction';
import {useDispatch, useSelector} from 'react-redux';

const Drawer = createDrawerNavigator();
const Auth = createStackNavigator();

const Navigation = () => {
  const dispatch = useDispatch();
  const AuthState = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 500);

  useEffect(() => {
    setToken();
  }, [AuthState.state.login]);

  useEffect(() => {
    if (AuthState && AuthState.state.token === null) {
      AuthState.checkIsLoggedIn();
    }
  }, []);

  useEffect(() => {
    dispatch(AppSettingAction());
  }, []);

  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          {AuthState &&
          AuthState.state &&
          !isEmpty(AuthState.state.token) &&
          AuthState.state.login ? (
            <Drawer.Navigator
              screenOptions={{
                headerShown: false,
                unmountOnBlur: true,
                lazy: false,
              }}
              backBehavior={'history'}
              detachInactiveScreens={true}
              drawerContent={props => <CustomDrawer {...props} />}>
              <Drawer.Screen name="Dashboard" component={DashboardScreen} />
              <Drawer.Screen name="Test" component={Test} />

              <Drawer.Screen name="AllProduct" component={AllProductsScreen} />
              <Drawer.Screen name="AddProduct" component={AddProductsScreen} />
              <Drawer.Screen
                name="EditProduct"
                component={EditProductsScreen}
              />
              {/* <Drawer.Screen name="ProductsScreen" component={ProductsScreen} /> */}

              <Drawer.Screen
                name="AllCategories"
                component={AllCategoriesScreen}
              />
              <Drawer.Screen
                name="EditCategory"
                component={EditCategoryScreen}
              />
              <Drawer.Screen name="AddCategory" component={AddCategoryScreen} />
              {/* <Drawer.Screen
                name="CategoryScreen"
                component={CategoriesScreens}
              /> */}

              <Drawer.Screen name="AllBrands" component={AllBrandsScreen} />
              <Drawer.Screen name="EditBrand" component={EditBrandScreen} />
              <Drawer.Screen name="AddBrand" component={AddBrandScreen} />
              {/* <Drawer.Screen name="BrandsScreens" component={BrandsScreens} /> */}

              <Drawer.Screen
                name="AllAttributes"
                component={AllAttributesScreen}
              />
              <Drawer.Screen
                name="EditAttribute"
                component={EditAttributeScreen}
              />
              <Drawer.Screen
                name="AddAttribute"
                component={AddAttributeScreen}
              />
              {/* <Drawer.Screen
                options={{unmountOnBlur: true}}
                name="AttrbutesScreen"
                component={AttrbutesScreen}
              /> */}

              <Drawer.Screen name="AllGroups" component={AllGroupsScreen} />
              <Drawer.Screen name="EditGroup" component={EditGroupsScreen} />
              <Drawer.Screen name="AddGroup" component={AddGroupsScreen} />
              {/* <Drawer.Screen name="GroupScreen" component={GroupScreen} /> */}

              <Drawer.Screen name="AllCoupons" component={AllCouponsScreen} />
              <Drawer.Screen name="EditCoupon" component={EditCouponsScreen} />
              <Drawer.Screen name="AddCoupons" component={AddCouponsScreen} />
              {/* <Drawer.Screen name="CouponScreen" component={CouponScreens} /> */}

              <Drawer.Screen
                name="AllCustomers"
                component={AllCustomerScreen}
              />
              <Drawer.Screen
                name="ViewCustomer"
                component={ViewCustomerScreen}
              />
              {/* <Drawer.Screen
                name="CustomersScreen"
                component={CustomersScreen}
              /> */}

              {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}

              <Drawer.Screen name="Order" component={AllOrdersScreen} />
              <Drawer.Screen name="ViewOrder" component={ViewOrderScreen} />
              {/* <Drawer.Screen name="OrdersScreen" component={OrdersScreen} /> */}

              {/* <Drawer.Screen name="Setting" component={SettingScreen} /> */}
            </Drawer.Navigator>
          ) : (
            <Auth.Navigator initialRouteName="Login">
              <Auth.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Auth.Screen
                name="Confirm"
                component={ConfirmScreen}
                options={{
                  headerTransparent: true,
                  title: '',
                }}
              />
              <Auth.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                  headerTransparent: true,
                  title: '',
                }}
              />
            </Auth.Navigator>
          )}
        </>
      )}
      {/* <InternetConnectivity /> */}
    </>
  );
};

export default Navigation;
