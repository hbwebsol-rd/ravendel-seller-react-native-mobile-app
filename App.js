import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import Navigation from './src/navigation';
import {createTheme, ThemeProvider} from '@rneui/themed';
import Alert from './src/screens/components/alert-modal';
import Colors from './src/utils/color';
// import {ApolloClient} from 'apollo-client';
// import {InMemoryCache} from 'apollo-cache-inmemory';
// import {createUploadLink} from 'apollo-upload-client';
// import {ApolloLink} from 'apollo-link';
import {ApolloProvider} from '@apollo/react-hooks';
import SyncStorage from 'sync-storage';
import SplashScreen from './src/screens/components/splash-screen';
import {Context as AuthContext} from './src/context/AuthContext';
import APclient from './src/client';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const AuthState = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(SyncStorage.get('token') || null);

  const StorageInit = async () => {
    var StorageStatus = await SyncStorage.init();
    var Token = SyncStorage.get('token') || null;
    setToken(Token);
    setLoading(false);
    // console.log('SyncStorage is ready!', StorageStatus);
    // console.log('Token', Token);
  };

  useEffect(() => {
    StorageInit();
  }, []);

  useEffect(() => {
    if (AuthState && AuthState.state && AuthState.state.token) {
      setToken(AuthState.state.token);
    }
  }, [AuthState]);

  if (loading) {
    return <SplashScreen />;
  }

  // const httpLink = new createUploadLink({
  //   uri: 'https://ravendel-backend.hbwebsol.com/graphql',
  // });

  // const authLink = new ApolloLink((operation, forward) => {
  //   operation.setContext({
  //     headers: {
  //       authorization: token,
  //     },
  //   });
  //   return forward(operation);
  // });

  // const APclient = new ApolloClient({
  //   link: authLink.concat(httpLink),
  //   cache: new InMemoryCache(),
  // });

  /* Theme */
  // const theme = {
  //   colors: {
  //     primary: Colors.primaryColor,
  //   },
  // };
  const theme = createTheme({
    components: {},
  });

  // /* For Networ API response */
  // if (__DEV__) {
  //   import('./src/utils/reactotron').then(() =>
  //     console.log('Reactotron Configured'),
  //   );
  // }

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <ApolloProvider client={APclient}>
            <ThemeProvider theme={theme}>
              <BottomSheetModalProvider>
                <NavigationContainer>
                  <Navigation />
                </NavigationContainer>
                <Alert />
              </BottomSheetModalProvider>
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
