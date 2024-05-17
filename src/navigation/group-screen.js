import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AllGroupsScreen, AddGroupsScreen, EditGroupsScreen} from '../screens';

const Stack = createStackNavigator();

const AttrbutesScreen = () => {
  return (
    <Stack.Navigator initialRouteName="AllGroups">
      <Stack.Screen
        name="AllGroups"
        component={AllGroupsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditGroup"
        component={EditGroupsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddGroup"
        component={AddGroupsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default AttrbutesScreen;
