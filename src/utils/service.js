// import jumpTo from './navigation';
import axios from 'axios';
import {getToken, isEmpty} from './helper';
import APclient from '../client';
import {useQuery} from '@apollo/client';
import {loginURL} from './baseurl';

export const mutation = async (query, variables, refetchQuery) => {
  try {
    const response = await APclient.mutate({
      mutation: query,
      variables,
      // awaitRefetchQueries: true,
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    console.log('Error is', errors);
    if (
      errors.graphQLErrors.length &&
      !isEmpty(errors.graphQLErrors[0].message)
    ) {
      return Promise.reject(errors.graphQLErrors[0].message);
    }
    if (
      !isEmpty(errors.networkError) &&
      errors.networkError.statusCode === 400
    ) {
      return Promise.reject(errors.message);
    }
    return Promise.reject('Something went wrong');
  }
};

export const query = async (query, variables) => {
  try {
    const response = await APclient.query({
      query: query,
      variables,
      fetchPolicy: 'network-only',
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    console.log('Error', errors.message);
    if (
      errors.graphQLErrors.length &&
      !isEmpty(errors.graphQLErrors[0].message)
    ) {
      console.log('pErroringddd', errors.message);
      return Promise.reject(errors.graphQLErrors[0].message);
    }
    if (
      !isEmpty(errors.networkError) &&
      errors.networkError.statusCode === 400
    ) {
      return Promise.resolve(errors.message);
    }
    return Promise.reject('Something went wrong');
  }
};

export const PostFetchWithoutToken = (url, registerDetails) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(registerDetails);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  try {
    const response = fetch(`${loginURL}${url}`, requestOptions).then(res => {
      return new Promise(resolve => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          res.json().then(json =>
            resolve({
              status: res.status,
              data: json,
            }),
          );
        } else {
          throw 'Something went wrong';
        }
      });
    });

    return Promise.resolve(response);
  } catch (error) {
    console.log('er', error);
    return Promise.reject(error);
  }
};

export const GetFetch = async url => {
  var token = await getToken();

  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  try {
    const response = fetch(`${loginURL}${url}`, requestOptions).then(res => {
      return new Promise(resolve => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          res.json().then(json =>
            resolve({
              status: res.status,
              data: json,
            }),
          );
        } else {
          throw 'Something went wrong';
        }
      });
    });

    return Promise.resolve(response);
  } catch (error) {
    console.log('er', error);
    return Promise.reject(error);
  }
};
