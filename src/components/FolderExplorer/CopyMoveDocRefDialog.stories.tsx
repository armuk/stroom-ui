import * as React from "react";
import { storiesOf } from "@storybook/react";
import { useState } from "react";

import StroomDecorator from "../../lib/storybook/StroomDecorator";
import { fromSetupSampleData } from "./test";
import CopyDocRefDialog, {
  useDialog as useCopyMoveDocRefDialog
} from "./CopyMoveDocRefDialog";

import "../../styles/main.css";
import { PermissionInheritance, DocRefType } from "../../types";
import JsonDebug from "../../lib/storybook/JsonDebug";

const testFolder2 = fromSetupSampleData.children![1];

interface Props {
  testUuids: Array<string>;
  testDestination: DocRefType;
}

// Copy
const TestCopyDialog = ({ testUuids, testDestination }: Props) => {
  const [lastConfirmed, setLastConfirmed] = useState<object>({});

  const { showDialog, componentProps } = useCopyMoveDocRefDialog(
    (
      uuids: Array<string>,
      destination: DocRefType,
      permissionInheritance: PermissionInheritance
    ) => setLastConfirmed({ uuids, destination, permissionInheritance })
  );

  return (
    <div>
      <h1>Copy Doc Ref Test</h1>
      <button onClick={() => showDialog(testUuids, testDestination)}>
        Show
      </button>
      <CopyDocRefDialog {...componentProps} />
      <JsonDebug currentValues={lastConfirmed} />
    </div>
  );
};

storiesOf("Explorer/Copy Doc Ref Dialog", module)
  .addDecorator(StroomDecorator)
  .add("simple", () => (
    <TestCopyDialog
      testUuids={testFolder2.children!.map(d => d.uuid)}
      testDestination={testFolder2}
    />
  ));
