import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, persistStore, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist'
import rootReducer from './rootReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import devToolsEnhancer from 'remote-redux-devtools'
import { NativeModules } from 'react-native'

// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true)
// }

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)


const storeCreator = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),

    devTools: false,
    enhancers: [devToolsEnhancer({
      realtime: true,
      host: 'localhost',
      port: 8000
    })],
  })
  const persistor = persistStore(store)
  return { store, persistor }
}

const storeInfo = storeCreator();

export default storeInfo;