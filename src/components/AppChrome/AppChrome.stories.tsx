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

import { storiesOf } from "@storybook/react";
import { Switch, Route } from "react-router-dom";

import AppChrome, { appChromeRoutes } from ".";
import { addThemedStories } from "../../testing/storybook/themedStoryGenerator";

// This basically replicates the 'Routes' implementation, but for test
const AppChromeWithRouter = () => (
  <Switch>
    {appChromeRoutes.map((p, i) => (
      <Route key={i} {...p} />
    ))}
  </Switch>
);

const storiesNoRouting = storiesOf("App Chrome/No Routing", module);
addThemedStories(storiesNoRouting, () => (
  <AppChrome activeMenuItem="welcome" content={<div>Stuff goes here</div>} />
));

const storiesWithRouting = storiesOf("App Chrome/With Routing", module);
addThemedStories(storiesWithRouting, () => <AppChromeWithRouter />);
