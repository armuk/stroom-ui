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

import IconHeader from "components/IconHeader";

const Welcome: React.FunctionComponent = () => (
  <div className="welcome">
    <div className="welcome__header">
      <IconHeader icon="home" text="Welcome" />
    </div>
    <div className="welcome__body">
      <img
        className="welcome__image"
        alt="Stroom logo"
        src={require("../../images/logo_orange.svg")}
      />
      <h1>About Stroom</h1>
      <p>Stroom is designed to receive data from multiple systems.</p>
      <div className="welcome__shortcuts">
        <h4>Global shortcut keys</h4>
        <table className="welcome__shortcuts__table">
          <tbody>
            <tr>
              <th />
              <th>Shortcut</th>
            </tr>
            <tr>
              <td>Document search</td>
              <td>
                <code>ctrl + shift + f</code>
              </td>
            </tr>
            <tr>
              <td> Recent documents </td>
              <td>
                <code> ctrl + shift + e</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Welcome;
