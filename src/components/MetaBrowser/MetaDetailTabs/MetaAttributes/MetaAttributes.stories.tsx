import * as React from "react";
import { storiesOf } from "@storybook/react";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";
import fullTestData from "testing/data";
import MetaAttributes from "./MetaAttributes";
import { StreamMetaRow } from "components/MetaBrowser/types";

const dataRow: StreamMetaRow = fullTestData.dataList.streamAttributeMaps[0];

const stories = storiesOf(
  "Sections/Meta Browser/Detail Tabs/Meta Attributes",
  module,
);

addThemedStories(stories, () => <MetaAttributes dataRow={dataRow} />);
