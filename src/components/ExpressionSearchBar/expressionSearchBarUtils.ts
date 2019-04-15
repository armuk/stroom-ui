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

import {
  DataSourceType,
  ExpressionItem,
  ExpressionOperatorType,
  ExpressionTermType,
  ConditionType,
} from "../ExpressionBuilder/types";

interface ValidationResult {
  original: string;
  parsed?: string[];
  fieldIsValid: boolean;
  conditionIsValid: boolean;
  valueIsValid: boolean;
  term?: ExpressionItem;
}

/**
 * A map of operators to ExpressionBuilder conditions
 */
const operatorMap = {
  "=": "EQUALS",
  ">": "GREATER_THAN",
  "<": "LESS_THAN",
  ">=": "GREATER_THAN_OR_EQUAL_TO",
  "<=": "LESS_THAN_OR_EQUAL_TO",
};

/**
 * Replaces the operator with one of the type used by the datasource,
 * e.g. = becomes 'EQUALS'
 * @param {array} criterion The search criterion as an array.
 */
const parse = (criterion: string) => {
  let split;
  Object.keys(operatorMap).forEach(key => {
    if (criterion.includes(key)) {
      split = criterion.split(key);
      split.splice(1, 0, operatorMap[key]);
    }
  });
  return split;
};

/**
 * Takes an input string and parses it into pairs, replacing the boolean
 * operators with ExpressionBuilder conditions.
 * @param {string} criteria The string from the search input box
 */
const split = (criteria: string) =>
  criteria
    .split(" ")
    .filter(criterion => criterion !== "" && criterion !== " ")
    .map(criterion => ({ criterion, splitCriterion: parse(criterion) }));

/**
 * Returns an ExpressionBuilder term
 * @param {string} field
 * @param {string} condition
 * @param {string} value
 */
const toTerm = (
  field: string,
  condition: ConditionType,
  value: string,
): ExpressionTermType => ({
  type: "term",
  field,
  condition,
  value,
  dictionary: null,
  enabled: true,
});

/**
 * Creates an ExpressionBuilder term from the passed array. The array must look like ['foo', 'EQUALS', 'bar'].
 * @param {array} asArray The term as an array
 */
const toTermFromArray = (asArray: string[]): ExpressionTermType =>
  toTerm(asArray[0], asArray[1] as ConditionType, asArray[2]);

/**
 * Takes a search string from the input box and checks that the fields
 * exist in the data source.
 * @param {object} dataSource The data source for the expression
 * @param {string} criteria The search string
 */
export const processSearchString = (
  dataSource: DataSourceType,
  criteria: string,
): {
  expression: ExpressionOperatorType;
  fields: ValidationResult[];
} => {
  const splitted = split(criteria);

  const validationResults: ValidationResult[] = [];
  splitted.forEach((criterionObj: any) => {
    let validationResult: ValidationResult;
    if (criterionObj.splitCriterion !== undefined) {
      // Field validation
      const field = criterionObj.splitCriterion[0];
      const foundField = dataSource.fields.filter(
        availableField => availableField.name === field,
      );
      const fieldIsValid = foundField.length > 0;

      // Condition/operator validation
      const operator = criterionObj.splitCriterion[1];
      const foundCondition = dataSource.fields.filter(
        availableField =>
          availableField.name === field &&
          availableField.conditions.find(condition => condition === operator),
      );
      const conditionIsValid = foundCondition.length > 0;

      // Value validation
      const value = criterionObj.splitCriterion[2];
      const valueIsValid = value !== undefined && value !== "";

      validationResult = {
        original: criterionObj.criterion,
        parsed: criterionObj.splitCriterion,
        fieldIsValid,
        conditionIsValid,
        valueIsValid,
        term: toTermFromArray(criterionObj.splitCriterion),
      };
    } else {
      // If we don't have a splitCriterion then the term is invalid and we'll return
      // a result with false for everything.
      validationResult = {
        original: criterionObj.criterion,
        fieldIsValid: false,
        conditionIsValid: false,
        valueIsValid: false,
      };
    }
    validationResults.push(validationResult);
  });

  const expression: ExpressionOperatorType = {
    type: "operator",
    op: "AND",
    children: validationResults
      .filter(
        (validationResult: ValidationResult) =>
          validationResult.term !== undefined,
      )
      .map(
        (validationResult: ValidationResult) =>
          validationResult.term as ExpressionTermType,
      ),
    enabled: true,
  };

  return { expression, fields: validationResults };
};
