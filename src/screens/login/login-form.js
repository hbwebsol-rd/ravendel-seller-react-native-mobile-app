import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView, ScrollView} from 'react-native';
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
import {BASE_URL} from '../../utils/helper';
import {useDispatch} from 'react-redux';
import {ALERT_ERROR} from '../../store/reducer/alert';
import AppLoader from '../components/loader';

const LoginForm = ({}) => {
  const dispatch = useDispatch();
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const {signin} = useContext(AuthContext);

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
            payload: 'Something went wrong. Please try again',
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
      <KeyboardAvoidingView behavior="padding" enabled>
        <ScrollView keyboardShouldPersistTaps={true}>
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
