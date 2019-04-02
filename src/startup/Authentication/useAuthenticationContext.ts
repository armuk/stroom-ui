import * as React from "react";

import AuthenticationContext from "./AuthenticationContext";

const useAuthenticationContext = () => useContext(AuthenticationContext);

export default useAuthenticationContext;
