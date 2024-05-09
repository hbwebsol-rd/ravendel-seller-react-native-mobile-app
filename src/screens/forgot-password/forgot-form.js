import React from 'react';
import {KeyboardAvoidingView, ScrollView} from 'react-native';
import {Input, Button} from '@rneui/themed';
import {ForgotWrapper, ForgotTitle} from './styles';
import {useFormik} from 'formik';
import {ForgotEmailValidation} from '../../validation';
import {Text} from '@rneui/base';
const ForgotForm = ({email, loading, handleChange, onSubmit}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: ForgotEmailValidation,
    onSubmit: (values, {setSubmitting, resetForm}) => {
      setSubmitting(false);
      sendValues(values);
      resetForm({values: ''});
    },
  });

  const sendValues = val => {
    // console.log(JSON.stringify(val));
    dispatch(MailByIts(val));
    setMultireset(true);
    dispatch({type: CLEAR_TEMPLATE});
    EditorRef.current?.setContentHTML('');
  };

  return (
    <ForgotWrapper>
      <KeyboardAvoidingView behavior="padding" enabled>
        <ScrollView>
          <ForgotTitle>Forgot Password</ForgotTitle>
          <Input
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
          />
          {formik.errors.email && formik.touched.email ? (
            <Text style={{color: 'red', fontSize: 12}}>
              {formik.errors.email}
            </Text>
          ) : null}
          <Button
            title="SEND"
            loading={loading}
            onPress={formik.handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ForgotWrapper>
  );
};

export default ForgotForm;
