import createDataContext from './createDataContext';
import SyncStorage from 'sync-storage';
import {isEmpty} from '../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signout':
      return {token: null, user: '', login: false};

    case 'signin':
      return {
        token: action.payload.token,
        user: action.payload.user,
        login: true,
      };

    case 'alreadyLogin':
      return {
        token: action.payload.token,
        user: action.payload.user,
        login: true,
      };
    default:
      return state;
  }
};

const signin = (dispatch) => {
  return ({token, user}) => {
    dispatch({
      type: 'signin',
      payload: {
        token,
        user,
      },
    });
  };
};

const signout = (dispatch) => {
  return async () => {
    SyncStorage.remove('token');
    SyncStorage.remove('user');
    dispatch({type: 'signout'});
  };
};

const checkIsLoggedIn = (dispatch) => {
  return async () => {
    const Token =await AsyncStorage.getItem('token') //SyncStorage.get('token');
    const User = await AsyncStorage.getItem('user') //SyncStorage.get('user');
    console.log(Token,User,' token user')
    if (!isEmpty(Token) && !isEmpty(User)) {
      dispatch({
        type: 'alreadyLogin',
        payload: {
          token: Token,
          user: User,
        },
      });
    }
  };
};

checkIsLoggedIn();

export const {Provider, Context} = createDataContext(
  authReducer,
  {signin, signout, checkIsLoggedIn},
  {token: null, user: '', login: false},
);
