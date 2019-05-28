/*
 * Copyright 2019 Crown Copyright
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

import ExpressionBuilder from "components/ExpressionBuilder";
import InlineInput from "components/InlineInput/InlineInput";
import { useMetaDataSource } from "components/MetaBrowser/api";
import * as React from "react";
import { ChangeEventHandler, useCallback, useEffect } from "react";
import TimeUnitSelect from "../TimeUnitSelect";
import { DataRetentionRule } from "../types/DataRetentionRule";
import "antd/dist/antd.css";
import { Switch } from "antd";
import { ControlledInput } from "lib/useForm/types";

interface Props {
  rule: DataRetentionRule;
  onChange: (dataRetentionRule: DataRetentionRule) => void;
}

const useHandlers = (
  rule: DataRetentionRule,
  onChange: (dataRetentionRule: DataRetentionRule) => void,
) => {
  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => onChange({ ...rule, name: e.target.value }),
    [rule, onChange],
  );

  const handleAgeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => onChange({ ...rule, age: Number(e.target.value) }),
    [rule, onChange],
  );

  const handleExpressionChange = useCallback(
    expression => onChange({ ...rule, expression }),
    [rule, onChange],
  );

  const handleTimeUnitChange = useCallback(
    e => onChange({ ...rule, timeUnit: e.target.value }),
    [rule, onChange],
  );

  const handleEnabledChange = useCallback(
    e => onChange({ ...rule, enabled: e }),
    [rule, onChange],
  );

  const handleForeverChange = useCallback(
    e => onChange({ ...rule, forever: e.target.value === "keep_forever" }),
    [rule, onChange],
  );

  return {
    handleNameChange,
    handleAgeChange,
    handleExpressionChange,
    handleTimeUnitChange,
    handleEnabledChange,
    handleForeverChange,
  };
};

const DataRetentionRuleEditor: React.FunctionComponent<
  ControlledInput<DataRetentionRule>
> = ({ value: rule, onChange }) => {
  const dataSource = useMetaDataSource();
  const {
    handleNameChange,
    handleAgeChange,
    handleExpressionChange,
    handleTimeUnitChange,
    handleEnabledChange,
    handleForeverChange,
  } = useHandlers(rule, onChange);

  return (
    <div>
      <div className="DataRetentionRuleEditor__header">
        <InlineInput value={rule.name} onChange={handleNameChange} />
        <Switch
          size="small"
          checked={rule.enabled}
          onChange={handleEnabledChange}
          defaultChecked
        />
      </div>

      <div className="DataRetentionRuleEditor__content">
        <div>
          <h4>Match the following:</h4>
          <ExpressionBuilder
            value={rule.expression}
            onChange={handleExpressionChange}
            editMode={true}
            dataSource={dataSource}
          />
        </div>
        <div>
          <h4>And then:</h4>
          <div className="DataRetentionRuleEditor__retention">
            <div>
              <label>
                <input
                  type="radio"
                  name="forever"
                  value="keep_forever"
                  checked={rule.forever}
                  onChange={handleForeverChange}
                />
                <span>keep forever</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="forever"
                  value="keep_then_delete"
                  checked={!rule.forever}
                  onChange={handleForeverChange}
                />
                <span>delete after </span>
              </label>
              <span>
                <InlineInput
                  type="number"
                  value={rule.age}
                  onChange={handleAgeChange}
                />
                <span> </span>
                <TimeUnitSelect
                  selected={rule.timeUnit}
                  onChange={handleTimeUnitChange}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetentionRuleEditor;
