import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import authSlice from "./slices/authSlice";
import workoutSlice from "./slices/workoutSlice";
import progressSlice from "./slices/progressSlice";
import uiSlice from "./slices/uiSlice";
import userSlice from "./slices/userSlice";
import exerciseSlice from "./slices/exerciseSlice";
import socialSlice from "./slices/socialSlice";
import appSlice from "./slices/appSlice";

// Dev check
const isDev = process.env.NODE_ENV !== "production";

// Persistable reducer (without API)
const persistableReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  workout: workoutSlice,
  exercise: exerciseSlice,
  progress: progressSlice,
  social: socialSlice,
  app: appSlice,
  ui: uiSlice,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // Only persist certain slices
  whitelist: ["auth", "user", "app"],
  // Don't persist sensitive or frequently changing data
  blacklist: ["workout", "exercise", "progress", "social"],
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, persistableReducer);

// Root reducer (with API)
const rootReducer = combineReducers({
  api: api.reducer,
  persisted: persistedReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Enable additional checks in development
      immutableCheck: isDev,
    }).concat(api.middleware),
  devTools: isDev,
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Store utilities
export const getState = () => store.getState();
export const dispatch = store.dispatch;
