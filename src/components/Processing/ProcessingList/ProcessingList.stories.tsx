import * as React from "react";

import { storiesOf } from "@storybook/react";
import ProcessingList from "./ProcessingList";
import { addThemedStories } from "testing/storybook/themedStoryGenerator";
import useStreamTasks from "components/Processing/useStreamTasks";
import JsonDebug from "testing/JsonDebug";
import { StreamTaskType } from "../types";

const stories = storiesOf("Sections/Processing/List", module);

const TestHarness = () => {
  const streamTasksApi = useStreamTasks();
  const [selectedTracker, setSelectedTracker] = React.useState<
    StreamTaskType | undefined
  >(undefined);
  const { fetchTrackers } = streamTasksApi;
  React.useEffect(fetchTrackers, [fetchTrackers]);

  return (
    <div className="fill-space">
      <ProcessingList
        streamTasksApi={streamTasksApi}
        onSelectionChanged={setSelectedTracker}
      />
      <JsonDebug value={{ selectedTracker }} />
    </div>
  );
};

addThemedStories(stories, () => <TestHarness />);
