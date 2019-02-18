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
import { useEffect, useState } from "react";

import { processSearchString } from "./expressionSearchBarUtils";
import Button from "../Button";
import {
  DataSourceType,
  StyledComponentProps,
  ExpressionOperatorWithUuid
} from "../../types";
import { assignRandomUuids } from "../../lib/treeUtils";
import { toString } from "../ExpressionBuilder/expressionBuilderUtils";
import { ExpressionBuilder } from "../ExpressionBuilder";

export interface Props extends StyledComponentProps {
  expression?: ExpressionOperatorWithUuid;
  onExpressionChange: (e: ExpressionOperatorWithUuid) => void;
  dataSource: DataSourceType;
  onSearch: (e: ExpressionOperatorWithUuid | string) => void;
  initialSearchString?: string;
}

const ExpressionSearchBar = ({
  initialSearchString,
  dataSource,
  expression,
  onExpressionChange,
  onSearch
}: Props) => {
  const [isExpression, setIsExpression] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>(
    initialSearchString || ""
  );
  const [isSearchStringValid, setIsSearchStringValid] = useState<boolean>(true);
  const [
    searchStringValidationMessages,
    setSearchStringValidationMessages
  ] = useState<Array<string>>([]);

  useEffect(() => {
    if (!expression) {
      const parsedExpression = processSearchString(dataSource, "");
      const e = assignRandomUuids(
        parsedExpression.expression
      ) as ExpressionOperatorWithUuid;
      onExpressionChange(e);
    }
    onSearch(isExpression && !!expression ? expression : searchString);
  }, []);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value }
  }) => {
    const expression = processSearchString(dataSource, value);
    const invalidFields = expression.fields.filter(
      field =>
        !field.conditionIsValid || !field.fieldIsValid || !field.valueIsValid
    );

    const searchStringValidationMessages: Array<string> = [];
    if (invalidFields.length > 0) {
      invalidFields.forEach(invalidField => {
        searchStringValidationMessages.push(
          `'${invalidField.original}' is not a valid search term`
        );
      });
    }

    setIsSearchStringValid(invalidFields.length === 0);
    setSearchStringValidationMessages(searchStringValidationMessages);
    setSearchString(value);

    const parsedExpression = processSearchString(dataSource, searchString);
    const e = assignRandomUuids(
      parsedExpression.expression
    ) as ExpressionOperatorWithUuid;
    onExpressionChange(e);
  };

  return (
    <div className="dropdown search-bar borderless">
      <div className="search-bar__header">
        <input
          placeholder="I.e. field1=value1 field2=value2"
          value={
            isExpression && !!expression ? toString(expression) : searchString
          }
          className="search-bar__input"
          onChange={onChange}
        />
        <Button
          disabled={!isSearchStringValid}
          icon="search"
          onClick={() => {
            onSearch(isExpression && !!expression ? expression : searchString);
          }}
        />
      </div>
      <div tabIndex={0} className={`dropdown__content search-bar__content`}>
        <div className="search-bar__content__header">
          <Button
            text="Text search"
            selected={!isExpression}
            icon="i-cursor"
            className="search-bar__modeButton raised-low bordered hoverable"
            onClick={() => {
              setIsExpression(false);
            }}
          />
          <Button
            text="Expression search"
            selected={isExpression}
            disabled={!isSearchStringValid}
            className="search-bar__modeButton raised-low bordered hoverable"
            icon="edit"
            onClick={() => {
              if (!isExpression) {
                const parsedExpression = processSearchString(
                  dataSource,
                  searchString
                );
                const e = assignRandomUuids(
                  parsedExpression.expression
                ) as ExpressionOperatorWithUuid;
                onExpressionChange(e);
                setIsExpression(true);
              }
            }}
          />
        </div>
        {isExpression && !!expression ? (
          <ExpressionBuilder
            className="search-bar__expressionBuilder"
            showModeToggle={false}
            editMode
            dataSource={dataSource}
            expression={expression}
            onChange={onExpressionChange}
          />
        ) : (
          <div>{searchStringValidationMessages}</div>
        )}
      </div>
    </div>
  );
};

export default ExpressionSearchBar;
