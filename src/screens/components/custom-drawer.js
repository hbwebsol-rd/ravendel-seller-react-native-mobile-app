import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Avatar, Text} from '@rneui/themed';
import {Context as AuthContext} from '../../context/AuthContext';
import {isEmpty, BASE_URL} from '../../utils/helper';

export function CustomDrawer(props) {
  const {state, signout} = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({
    name: '',
    image: '',
  });

  // useEffect(() => {
  //   if (state && state.user) {
  //     setUserDetails({
  //       name: 'tins',
  //       image: '',
  //     })
  //     // setUserDetails(JSON.parse(state.user));
  //   }
  // }, [state]);

  const logout = () => {
    Alert.alert(
      'Are you sure?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: signout,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfoWrapper}>
              {isEmpty(userDetails.image) &&
              isEmpty(userDetails.image.original) ? null : (
                <Avatar
                  rounded
                  size="small"
                  source={{
                    uri: BASE_URL + userDetails.image.original,
                  }}
                />
              )}
              <View style={styles.userTitle}>
                <Text style={styles.title}>{userDetails.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="th-large" color={color} size={18} />
              )}
              label="Dashboard"
              onPress={() => {
                props.navigation.navigate('Dashboard');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="shopping-cart" color={color} size={17} />
              )}
              label="Order"
              onPress={() => {
                props.navigation.navigate('Order');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="boxes" color={color} size={18} />
              )}
              label="Products"
              onPress={() => {
                props.navigation.navigate('AllProduct');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="boxes" color={color} size={18} />
              )}
              label="Categories"
              onPress={() => {
                props.navigation.navigate('AllCategories');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="boxes" color={color} size={18} />
              )}
              label="Attributes"
              onPress={() => {
                props.navigation.navigate('AllAttributes');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="boxes" color={color} size={18} />
              )}
              label="Group"
              onPress={() => {
                props.navigation.navigate('AllGroups');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="boxes" color={color} size={18} />
              )}
              label="Brands"
              onPress={() => {
                props.navigation.navigate('AllBrands');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="star-of-life" color={color} size={size} />
              )}
              label="Coupons"
              onPress={() => {
                props.navigation.navigate('AllCoupons');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="users" color={color} size={18} />
              )}
              label="Customers"
              onPress={() => {
                props.navigation.navigate('AllCustomers');
              }}
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="user-circle" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cog" color={color} size={size} />
              )}
              label="Setting"
              onPress={() => {
                props.navigation.navigate('Setting');
              }}
            /> */}
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="sign-out-alt" color={color} size={size} />
          )}
          label="Log out"
          onPress={logout}
        />
        <Text style={styles.branding}>Ravendel 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  userTitle: {marginLeft: 15},
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  branding: {
    textAlign: 'center',
  },
});
