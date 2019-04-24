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
import { Switch, Route, RouteComponentProps } from "react-router";

import IndexVolumeGroups from "./IndexVolumeGroups";
import IndexVolumeGroupEditor from "./IndexVolumeGroupEditor";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";

const TestHarness = () => (
  <Switch>
    <Route
      exact
      path="/s/indexing/groups/:groupName"
      render={(props: RouteComponentProps<any>) => (
        <IndexVolumeGroupEditor groupName={props.match.params.groupName} />
      )}
    />
    <Route component={IndexVolumeGroups} />
  </Switch>
);

const stories = storiesOf("Sections/Index Volume Groups", module);

addThemedStories(stories, () => <TestHarness />);
