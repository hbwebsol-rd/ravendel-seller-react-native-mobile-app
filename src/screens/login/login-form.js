import React, {useContext, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, Button} from '@rneui/themed';
import {
  LoginWrapper,
  LoginTitle,
  ForgotPasswordBtn,
  ForgotPasswordText,
} from './styles';
import {ForgotEmailValidation, LoginValidation} from '../../validation';
import {useFormik} from 'formik';
import {Text} from '@rneui/base';
import axios from 'axios';
import {Context as AuthContext} from '../../context/AuthContext';
import SyncStorage from 'sync-storage';
import {BASE_URL, ONE_SIGNAL_APP_ID} from '../../utils/helper';
import {useDispatch, useSelector} from 'react-redux';
import {ALERT_ERROR} from '../../store/reducer/alert';
import AppLoader from '../components/loader';
import ThemeColor from '../../utils/color';
import {OneSignal} from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAVE_DEVICE_ID } from '../../queries/userQueries';
import APclient from '../../client';
import { GraphqlError, GraphqlSuccess } from '../components/garphqlMessages';
import { useMutation } from '@apollo/client';

const LoginForm = ({}) => {
  const dispatch = useDispatch();
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const {signin} = useContext(AuthContext);
  const {logo} = useSelector(state => state.dashboard.theme);

  const [addDeviceInfo, {loading: addedLoading}] = useMutation(SAVE_DEVICE_ID, {
    onError: error => {
      GraphqlError(error);
    },
    onCompleted: data => {
      console.log(data,' data data');
    },
  });
  const save_playerid = async player_id => {
    addDeviceInfo({variables: {deviceInfo:  {
      "device_id": player_id,
      "device_type": Platform.OS.toUpperCase(),
      "app_version": "1.0"
    }}});
  };

  const setDeviceId = async () => {
    const deviceState = await OneSignal.User.pushSubscription.getIdAsync();
    // const pid = await getValue('playerid');
    console.log(deviceState, 'Plaery Id Get');
    // if (deviceState && deviceState.userId && isEmpty(pid)) {
    save_playerid(deviceState); //
    // }
  };

  const InitOneSignal = async () => {
    OneSignal.initialize(ONE_SIGNAL_APP_ID)
    OneSignal.setConsentRequired(true);
    OneSignal.setConsentGiven(true);
    
    setTimeout(() => {
      setDeviceId();
    }, 12000);
  };

  const handleSecure = () => {
    setSecure(!secure);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginValidation,
    onSubmit: (values, {setSubmitting, resetForm}) => {
      setSubmitting(false);
      sendValues(values);
      // resetForm({values: ''});
    },
  });

  const sendValues = val => {
    setLoading(true);
    const loginDetail = {
      email: val.email,
      password: val.password,
    };
    axios
      .post(`${BASE_URL}apis/users/login`, loginDetail)
      .then(async response => {
        console.log(response, 'rrrs');
        if (response.status === 200) {
          InitOneSignal();
          AsyncStorage.setItem('token', response.data.token)
          AsyncStorage.setItem('user',  JSON.stringify(response.data))
          SyncStorage.set('token', response.data.token);
          SyncStorage.set('user', JSON.stringify(response.data));
          signin({
            token: response.data.token,
            user: JSON.stringify(response.data),
          });
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'rrrs', `${BASE_URL}apis/users/login`);
        console.log(error.response.data);
        if (
          error.response &&
          error.response.status &&
          error.response.status === 400
        ) {
          dispatch({type: ALERT_ERROR, payload: error.response.data});
          // showAletMessage(error.response.data);
        } else {
          dispatch({
            type: ALERT_ERROR,
            payload: 'Invalid Email or password',
          });
          // showAletMessage('Something went wrong. Please try again');
        }
      });
  };

  if (loading) {
    return <AppLoader />;
  }
  return (
    <LoginWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled>
        <ScrollView keyboardShouldPersistTaps={true}>
          <Image
            source={{uri: BASE_URL + logo}}
            style={{
              width: 100,
              height: 100,
              marginBottom: 10,
              alignSelf: 'center',
            }}
          />
          <LoginTitle>Login</LoginTitle>
          <Input
            containerStyle={{
              height: 80,
            }}
            label="Email"
            value={formik.values.email}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onChangeText={formik.handleChange('email')}
          />
          {formik.errors.email && formik.touched.email ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                marginBottom: 15,
                marginLeft: 10,
              }}>
              {formik.errors.email}
            </Text>
          ) : null}
          <Input
            containerStyle={{
              height: 80,
            }}
            label="Password"
            value={formik.values.password}
            secureTextEntry={secure}
            leftIcon={<Icon name="lock" size={24} color="black" />}
            onChangeText={formik.handleChange('password')}
            rightIcon={
              secure ? (
                <Icon
                  onPress={() => handleSecure()}
                  name="eye"
                  size={24}
                  color="black"
                />
              ) : (
                <Icon
                  onPress={() => handleSecure()}
                  name="eye-slash"
                  size={24}
                  color="black"
                />
              )
            }
          />
          {formik.errors.password && formik.touched.password ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                marginLeft: 10,
                marginBottom: 10,
              }}>
              {formik.errors.password}
            </Text>
          ) : null}
          <Button
            color={ThemeColor.primaryColor}
            title="LOGIN"
            loading={loading}
            onPress={formik.handleSubmit}
          />

          {/* <ForgotPasswordBtn
            onPress={() => navigation.navigate('ForgotPassword')}>
            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
          </ForgotPasswordBtn> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </LoginWrapper>
  );
};

export default LoginForm;
