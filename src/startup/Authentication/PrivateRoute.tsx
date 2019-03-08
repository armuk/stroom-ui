/*
 * Copyright 2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { Route, RouteProps } from "react-router-dom";

import AuthenticationRequest from "./AuthenticationRequest";
import useReduxState from "../../lib/useReduxState";
import Loader from "../../components/Loader";
import useConfig from "../config/useConfig";

const PrivateRoute = ({ render, ...rest }: RouteProps) => {
  const config = useConfig();
  const idToken = useReduxState(({ authentication: { idToken } }) => idToken);

  const {
    isReady,
    values: { advertisedUrl, appClientId, authenticationServiceUrl }
  } = config;

  if (
    !(isReady && !!advertisedUrl && !!appClientId && !!authenticationServiceUrl)
  ) {
    return <Loader message="Waiting for config" />;
  }

  return (
    <Route
      {...rest}
      render={props =>
        !!idToken ? (
          render && render({ ...props })
        ) : (
          <AuthenticationRequest
            referrer={props.match.url}
            uiUrl={advertisedUrl}
            appClientId={appClientId}
            authenticationServiceUrl={authenticationServiceUrl}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
