import * as React from "react";

import Select from "react-select";
import { SelectOptionType } from "src/types";
import { IsGroup } from "src/api/userGroups";

interface Props {
  value?: IsGroup;
  onChange: (v: IsGroup) => any;
}

const IS_GROUP_OPTIONS: SelectOptionType[] = [
  {
    label: "N/A",
    value: "",
  },
  {
    label: "Group",
    value: "Group",
  },
  {
    label: "User",
    value: "user",
  },
];

const IsGroupFilterPicker: React.FunctionComponent<Props> = ({
  value,
  onChange,
}) => (
  <Select
    value={IS_GROUP_OPTIONS.find(o => o.value === value)}
    onChange={React.useCallback(
      (o: SelectOptionType) => onChange(o.value as IsGroup),
      [onChange],
    )}
    placeholder="Is Group"
    options={IS_GROUP_OPTIONS}
  />
);

export default IsGroupFilterPicker;
