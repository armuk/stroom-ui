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

import * as React from "react";

// This supplies default internal value/onChange pair if
// such things are not part of the given props
const useControlledInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>,
): React.InputHTMLAttributes<HTMLInputElement> => {
  const [value, setValue] = React.useState<string>("");
  const onChange = React.useCallback(
    ({ target: { value } }) => setValue(value),
    [setValue],
  );

  if (props.onChange && props.value) {
    return props;
  } else {
    return { ...props, onChange, value };
  }
};

const InlineInput: React.FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ onChange: _onChange, value: _value, ...rest }) => {
  const { onChange, value } = useControlledInput({
    onChange: _onChange,
    value: _value,
  });

  const [isEditing, setEditing] = React.useState(false);
  if (isEditing) {
    return (
      <input
        autoFocus={true}
        className="inline-input__editing"
        onBlur={() => {
          // Blurring sets the value
          setEditing(false);
        }}
        onChange={onChange}
        type="text"
        value={value}
        onKeyDown={event => {
          if (event.key === "Enter") {
            event.preventDefault();
            // 'Enter' sets the value
            setEditing(false);
          } else if (event.key === "Escape") {
            event.preventDefault();
            // 'Escape' does not set the value, and we need to update the
            // editing value to the original.
            setEditing(false);
          }
        }}
        {...rest}
      />
    );
  } else {
    const textToDisplay = !!value ? value : "click to edit";
    return (
      <span
        className="inline-input__not-editing"
        onClick={() => setEditing(true)}
      >
        {textToDisplay}
      </span>
    );
  }
};

export default InlineInput;
