import React, {useState, useContext} from 'react';
import {Text} from 'react-native';
import {Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import {BASE_URL} from '../../utils/helper';
import AppLoader from '../components/loader';
import {Context as AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import OTPTextView from 'react-native-otp-textinput';
import {Button} from '@rneui/themed';
import {OTPWrapper} from './styles';
import Colors from '../../utils/color';

const ConfirmScreen = ({navigation, route}) => {
  const {signin} = useContext(AuthContext);
  const {loginDetail} = route.params;
  const [loading, setLoading] = useState(false);
  const [otpInput, setotpInput] = useState('');

  const showAletMessage = message => {
    Alert.alert(message, '', [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ]);
  };

  const onSubmit = async () => {
    setLoading(true);

    if (otpInput === null || otpInput.length < 4) {
      showAletMessage('Please enter OTP code');
    } else {
      console.log(loginDetail, 'login');
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
          }
        })
        .catch(error => {
          console.log(error, 'rrrs', `${BASE_URL}apis/users/login`);
          if (
            error.response &&
            error.response.status &&
            error.response.status === 400
          ) {
            showAletMessage(error.response.data);
          } else {
            showAletMessage('Something went wrong. Please try again');
          }
        });
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      <OTPWrapper>
        <Text>Please Enter Otp Code</Text>
        <OTPTextView
          handleTextChange={text => setotpInput(text)}
          inputCount={4}
          keyboardType="numeric"
          containerStyle={{width: '90%', marginBottom: 20, marginTop: 20}}
          textInputStyle={{width: 40, fontSize: 16}}
          tintColor={Colors.primaryColor}
        />
        <Button title="Submit" onPress={onSubmit} />
      </OTPWrapper>
    </>
  );
};

export default ConfirmScreen;
