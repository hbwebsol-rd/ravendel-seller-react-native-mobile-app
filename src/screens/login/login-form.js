import React, {useState} from 'react';
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

const LoginForm = ({
  loginDetail,
  loading,
  handleChange,
  onSubmit,
  navigation,
}) => {
  const [secure, setSecure] = useState(true);

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
      resetForm({values: ''});
    },
  });

  const sendValues = val => {
    // console.log(JSON.stringify(val));
    const loginDetail = {
      email: val.email,
      password: val.password,
    };
    navigation.navigate('Confirm', {
      loginDetail: loginDetail,
    });
  };

  return (
    <LoginWrapper>
      <KeyboardAvoidingView behavior="padding" enabled>
        <ScrollView>
          <LoginTitle>Login</LoginTitle>
          <Input
            label="Email"
            value={formik.values.email}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onChangeText={formik.handleChange('email')}
          />
          {formik.errors.email && formik.touched.email ? (
            <Text style={{color: 'red', fontSize: 12}}>
              {formik.errors.email}
            </Text>
          ) : null}
          <Input
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
            <Text style={{color: 'red', fontSize: 12}}>
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
