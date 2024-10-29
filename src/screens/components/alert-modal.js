import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {useDispatch, useSelector} from 'react-redux';
import {ALERT_HIDE} from '../../store/reducer/alert';

const Alert = () => {
  const dispatch = useDispatch();
  const alert = useSelector(state => state.alert);
  const [isOpen, setisOpen] = useState(false);
  const HideAlert = () => {
    // setTimeout(() => {
    //   setisOpen(false);
    //   dispatch({
    //     type: ALERT_HIDE,
    //   });
    // }, 4000);
  };

  useEffect(() => {
    if (alert.success) {
      setisOpen(true);
      HideAlert();
    }
  }, [alert.success]);

  useEffect(() => {
    if (alert.error) {
      setisOpen(true);
      HideAlert();
    }
  }, [alert.error]);

  const hideAlert = () => {
    setisOpen(false);
    dispatch({
      type: ALERT_HIDE,
    });
  };
  console.log(isOpen);
  return (
    <AwesomeAlert
      show={isOpen}
      showProgress={false}
      title={alert.error ? 'Error' : alert.success ? 'Success' : ''}
      // messageStyle={{display: 'none'}}
      message={alert.message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={false}
      cancelText="Close"
      // confirmText="Yes, delete it"
      confirmButtonColor="#DD6B55"
      onCancelPressed={() => {
        hideAlert();
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Alert;
