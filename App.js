import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import Navigation from './src/navigation';
import {createTheme, ThemeProvider} from '@rneui/themed';
import Alert from './src/screens/components/alert-modal';
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
    var Token = SyncStorage.get('token') || null;
    setToken(Token);
    setLoading(false);
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

  const theme = createTheme({
    components: {},
  });

  const linking = {
    prefixes: ['zemjetseller://', 'https://zemjetseller'],
    config: {
      initialRouteName: 'Dashboard',
      screens: {
        Dashboard: {
          path: 'Dashboard',
        },
        ViewOrder: {
          path: 'ViewOrder/:id',
        },
      },
    },
  };

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <ApolloProvider client={APclient}>
            <ThemeProvider theme={theme}>
              <BottomSheetModalProvider>
                <NavigationContainer linking={linking}>
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
