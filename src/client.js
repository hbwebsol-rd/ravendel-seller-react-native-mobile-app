import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  from,
  ApolloProvider,
  gql,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {BASE_URL, getToken, isEmpty} from './utils/helper';
import SyncStorage from 'sync-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink = createHttpLink({
  // uri:`https://ravendel.herokuapp.com/graphql`,
  uri: `${BASE_URL}graphql`,
  // uri: `http://192.168.1.13:8000/graphql`,
});
const authMiddleware = new ApolloLink(async (operation, forward) => {
  const token = await AsyncStorage.getItem('token')
  // console.log(token)
  operation.setContext(({headers = {}}) => ({
    headers: {
      ...headers,
      authorization: !isEmpty(token) ? JSON.parse(token) : '',
    },
  }));
  return forward(operation);
});
const APclient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});
export default APclient;
