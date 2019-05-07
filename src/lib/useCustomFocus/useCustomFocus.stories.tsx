import * as React from "react";
import * as loremIpsum from "lorem-ipsum";
import { storiesOf } from "@storybook/react";
import useCustomFocus from "./useCustomFocus";
import JsonDebug from "testing/JsonDebug";
import useListReducer from "lib/useListReducer";

const generateItem = () => loremIpsum({ count: 3, units: "words" });

const TEST_ITEMS: string[] = Array(5)
  .fill(null)
  .map(generateItem);

const focusStyle: React.CSSProperties = {
  border: "solid thin black",
};

interface Props {
  initialItems: string[];
}

const TestHarness: React.FunctionComponent<Props> = ({ initialItems }) => {
  const { items, itemAtIndexRemoved } = useListReducer(d => d, initialItems);

  const { down, up, clear, focusIndex, focussedItem } = useCustomFocus({
    items,
  });

  const removeFirstItem = React.useCallback(() => itemAtIndexRemoved(0), [
    itemAtIndexRemoved,
  ]);

  return (
    <div>
      <h1>Custom Focus Test</h1>
      {items.map((item, i) => (
        <div key={i} style={i === focusIndex ? focusStyle : {}}>
          {item}
        </div>
      ))}
      <button onClick={up}>Up</button>
      <button onClick={down}>Down</button>
      <button onClick={clear}>Clear</button>
      <button onClick={removeFirstItem}>Remove First</button>
      <JsonDebug value={{ focusIndex, focussedItem }} />
    </div>
  );
};

storiesOf("lib/useCustomFocus", module).add("basic", () => (
  <TestHarness initialItems={TEST_ITEMS} />
));