import * as React from "react";

import { storiesOf } from "@storybook/react";
import ExpressionTerm from ".";
import { addThemedStories } from "src/testing/storybook/themedStoryGenerator";

import { testDataSource as dataSource } from "../test";
import { ExpressionTermType } from "../types";
import { getNewTerm } from "../expressionUtils";
import JsonDebug from "src/testing/JsonDebug";
import Button from "src/components/Button";
import useToggle from "src/lib/useToggle";

const stories = storiesOf("Expression/Term", module);

const newTerm: ExpressionTermType = getNewTerm();

const TestHarness: React.FunctionComponent = () => {
  const [index, onIndexChange] = React.useState<number>(67);
  const [value, onValueChange] = React.useState<ExpressionTermType>(newTerm);
  const [deletedId, onDelete] = React.useState<number | undefined>(undefined);

  const resetDelete = React.useCallback(() => onDelete(undefined), [onDelete]);
  const onChange = React.useCallback(
    (_value: ExpressionTermType, _index: number) => {
      onIndexChange(_index);
      onValueChange(_value);
    },
    [onIndexChange, onValueChange],
  );

  const { value: isEnabled, toggle: toggleIsEnabled } = useToggle(true);

  return (
    <div>
      <ExpressionTerm
        {...{
          index,
          isEnabled,
          dataSource,
          onDelete,
          value,
          onChange,
        }}
      />
      <Button text="Toggle Parent Enable" onClick={toggleIsEnabled} />
      <Button text="Reset Delete" onClick={resetDelete} />
      <JsonDebug value={{ index, value, isEnabled, deletedId }} />
    </div>
  );
};

addThemedStories(stories, () => <TestHarness />);
