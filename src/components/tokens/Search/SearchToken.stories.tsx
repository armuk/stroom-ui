import * as React from "react";
import { storiesOf } from "@storybook/react";
import { SearchToken } from "..";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";

const stories = storiesOf("Tokens/Search", module);

addThemedStories(stories, () => <SearchToken />);
