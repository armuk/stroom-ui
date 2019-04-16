/*
 * Copyright 2017 Crown Copyright
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
import { useConfig } from "src/startup/config";
import "src/styles/from_auth/Layout.css";
import ConfirmPasswordResetEmail from "./ConfirmPasswordResetEmail";

const ConfirmPasswordResetEmailContainer = () => {
  const { stroomUiUrl } = useConfig();
  if (!stroomUiUrl) throw Error("Config not ready or misconfigured!");
  return (
    <ConfirmPasswordResetEmail
      onBack={() => {
        window.location.href = stroomUiUrl;
      }}
    />
  );
};

export default ConfirmPasswordResetEmailContainer;
