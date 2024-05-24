import React, {useContext, useState} from 'react';
import LoginForm from './login-form';
import {Alert} from 'react-native';
import AppLoader from '../components/loader';
import {ALERT_ERROR} from '../../store/reducer/alert';
import axios from 'axios';
import {Context as AuthContext} from '../../context/AuthContext';
import SyncStorage from 'sync-storage';
import {BASE_URL} from '../../utils/helper';

const LoginScreen = ({navigation}) => {
  const {signin} = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? <AppLoader /> : null}
      <LoginForm loading={loading} />
    </>
  );
};

export default LoginScreen;
