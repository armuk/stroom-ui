import * as React from "react";

import { storiesOf } from "@storybook/react";

import DeleteExpressionItem, { useDialog } from "./DeleteExpressionItem";
import JsonDebug from "src/testing/JsonDebug";
import Button from "../../Button";
import { addThemedStories } from "src/testing/storybook/themedStoryGenerator";
import { getNewOperator } from "../expressionUtils";
import { ExpressionItem } from "../types";

const EXPRESSION_ITEM: ExpressionItem = getNewOperator();

const stories = storiesOf("Expression/Delete Expression Item", module);

const TestHarness: React.FunctionComponent = () => {
  const [itemDeleted, setItemDeleted] = React.useState<
    ExpressionItem | undefined
  >(undefined);

  const { showDialog, componentProps } = useDialog(setItemDeleted);

  const clearItemDeleted = React.useCallback(() => {
    setItemDeleted(undefined);
  }, [setItemDeleted]);

  const showDialogForTestItem = React.useCallback(() => {
    showDialog(EXPRESSION_ITEM);
  }, [showDialog]);

  return (
    <div>
      <DeleteExpressionItem {...componentProps} />
      <Button text="Show Dialog" onClick={showDialogForTestItem} />
      <Button text="Reset" onClick={clearItemDeleted} />
      <JsonDebug value={{ itemDeleted }} />
    </div>
  );
};
addThemedStories(stories, () => <TestHarness />);
