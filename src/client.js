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

const httpLink = createHttpLink({
  // uri:`https://ravendel.herokuapp.com/graphql`,
  uri: `${BASE_URL}graphql`,
  // uri: `http://192.168.1.13:8000/graphql`,
});
const authMiddleware = new ApolloLink(async (operation, forward) => {
  const token = await SyncStorage.get('token');
  operation.setContext(({headers = {}}) => ({
    headers: {
      ...headers,
      authorization: !isEmpty(token) ? token : '',
    },
  }));
  return forward(operation);
});
const APclient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});
export default APclient;
