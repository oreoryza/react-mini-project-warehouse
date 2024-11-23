import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./async/dataSlice";
import logReducer from "./async/logSlice";
import langReducer from "./slices/langSlice";
import themeReducer from "./slices/themeSlice";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage,
  };

const persistedLang = persistReducer(persistConfig, langReducer);
const persistedTheme = persistReducer(persistConfig, themeReducer);

const store = configureStore({
  reducer: {
    products: dataReducer,
    logs: logReducer,
    lang: persistedLang,
    theme: persistedTheme
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // menonaktifkan pemeriksaan serializability
    }),
});

const persistor = persistStore(store);

export { store, persistor };