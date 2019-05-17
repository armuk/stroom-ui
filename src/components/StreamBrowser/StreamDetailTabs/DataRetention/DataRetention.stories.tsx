import * as React from "react";
import { storiesOf } from "@storybook/react";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";
import fullTestData from "testing/data";
import DataRetention from "./DataRetention";
import { StreamMetaRow } from "components/StreamBrowser/types";

const dataRow: StreamMetaRow = fullTestData.dataList.streamAttributeMaps[0];

const stories = storiesOf(
  "Sections/Stream Browser/Detail Tabs/Data Retention",
  module,
);

addThemedStories(stories, () => <DataRetention dataRow={dataRow} />);
