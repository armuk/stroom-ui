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

import Routes from "./Routes";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";
import useAppNavigation from "../../lib/useAppNavigation/useAppNavigation";
import { WithChromeContext } from "lib/useRouter/BrowserRouter";
import Button from "components/Button";
import useRouter from "lib/useRouter";
import { ButtonAppearance } from "components/Button/types";

const storiesWithChrome = storiesOf("App Chrome/With Chrome", module);
addThemedStories(storiesWithChrome, () => <Routes />);

const TestHarness: React.FunctionComponent = () => {
  const {
    goToAuthorisationManager,
    goToIndexVolumes,
    goToIndexVolumeGroups,
  } = useAppNavigation();
  const {
    history: { location },
  } = useRouter();
  const { setUrlPrefix } = React.useContext(WithChromeContext);

  React.useEffect(() => setUrlPrefix("NOCHROME"), [setUrlPrefix]);

  const goToAuthorisationUsers = React.useCallback(() => {
    goToAuthorisationManager(false.toString());
  }, [goToAuthorisationManager]);

  const goToAuthorisationGroups = React.useCallback(() => {
    goToAuthorisationManager(true.toString());
  }, [goToAuthorisationManager]);

  return (
    <div>
      <div style={{ backgroundColor: "lightblue", padding: "0.7rem" }}>
        <h4>Test Navigation {location.pathname}</h4>
        <Button
          appearance={ButtonAppearance.Text}
          onClick={goToAuthorisationUsers}
          text="Go To Authorisation for Users"
        />
        <Button
          appearance={ButtonAppearance.Text}
          onClick={goToAuthorisationGroups}
          text="Go To Authorisation for Groups"
        />
        <Button
          appearance={ButtonAppearance.Text}
          onClick={goToIndexVolumes}
          text="Go To Index Volumes"
        />
        <Button
          appearance={ButtonAppearance.Text}
          onClick={goToIndexVolumeGroups}
          text="Go To Index Volume Groups"
        />
      </div>
      <Routes />
    </div>
  );
};

const storiesFullScreen = storiesOf("App Chrome/Full Screen", module);

addThemedStories(storiesFullScreen, () => <TestHarness />);
