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

import { storiesOf } from "@storybook/react";
import * as React from "react";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";
import InlineSelect, { SelectOption } from "./InlineSelect";
import { action } from "@storybook/addon-actions";

const stories = storiesOf("General Purpose/InlineSelect", module);

const options: SelectOption[] = [
  { value: "leia", label: "Princess Leia" },
  { value: "han", label: "Han Solo" },
  { value: "jabba", label: "Jabba the Hut" },
  { value: "luke", label: "Luke Skywalker" },
  { value: "everyone", label: "everyone" },
];

const TestHarness: React.FunctionComponent<{ inlineSelect: any }> = ({
  inlineSelect,
}) => (
  <div>
    <form>
      <span>I would like to feed </span>
      {inlineSelect}
      <span> to the sarlacc.</span>
    </form>
  </div>
);

stories.add("With onChange", () => (
  <TestHarness
    inlineSelect={
      <InlineSelect options={options} onChange={action("onChange")} />
    }
  />
));

stories.add("With value", () => (
  <TestHarness
    inlineSelect={<InlineSelect options={options} selected="everyone" />}
  />
));

addThemedStories(stories, () => (
  <TestHarness inlineSelect={<InlineSelect options={options} />} />
));