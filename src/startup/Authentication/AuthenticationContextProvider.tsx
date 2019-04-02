import * as React from "react";

import AuthenticationContext from "./AuthenticationContext";

const AuthenticationContextProvider: FunctionComponent = ({ children }) => {
  const [idToken, setIdToken] = React.useState<string>("");

  return (
    <AuthenticationContext.Provider value={{ idToken, setIdToken }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
