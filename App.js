import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Chat from './Component/Chat/Chat';
import ChatList from './Component/Chat/ChatList';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import storeInfo from './src/redux/store'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const { store, persistor } = storeInfo;


const Screens = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Chat}
      />
      <Stack.Screen name="ChatList" component={ChatList} />
    </Stack.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <Screens />
        {/* </PersistGate> */}
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
