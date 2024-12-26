"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  //const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      {/*   <PersistGate loading={null} persistor={persistor}> */}
      {children}
      {/*    </PersistGate> */}
    </Provider>
  );
}
