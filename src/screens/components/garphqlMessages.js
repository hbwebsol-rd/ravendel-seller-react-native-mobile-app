import {Alert} from 'react-native';
import {isEmpty} from '../../utils/helper';

export const GraphqlError = error => {
  if (error?.graphQLErrors?.length > 0) {
    error.graphQLErrors.map((err, i) => {
      Alert.alert('Error', err.message ? err.message : 'Something went wrong', [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
    });
  } else {
    Alert.alert('Error', 'Something went wrong', [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ]);
  }
};

export const GraphqlSuccess = successMsg => {
  if (!isEmpty(successMsg)) {
    Alert.alert('Success', successMsg, [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ]);
  }
};
