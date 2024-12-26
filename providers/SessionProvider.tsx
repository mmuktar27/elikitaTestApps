import React from "react";
import { SessionProvider } from "next-auth/react";

const SessionProviderComponent = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderComponent;
