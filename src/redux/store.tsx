import { configureStore } from '@reduxjs/toolkit'; //simplifies the store setup
import propertiesReducer from '../features/properties/PropertiesSlice';

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
