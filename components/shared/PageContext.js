"use client";

import { createContext, useContext } from "react";
import React, { useState } from "react";

// Create a Context
const PageContext = createContext();

// Provide Context to the app
export const PageProvider = ({ children }) => {
  const [activepage, setIsactivepage] = useState(null);

  return (
    <PageContext.Provider value={{ activepage, setIsactivepage }}>
      {children}
    </PageContext.Provider>
  );
};
export const usePage = () => useContext(PageContext);
