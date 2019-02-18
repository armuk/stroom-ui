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

import PipelineEditor from "./PipelineEditor";
import Pipeline from "./Pipeline";

import { reducer, actionCreators, StoreState } from "./redux";
import { fetchPipeline, searchPipelines } from "./client";
import { fetchElements, fetchElementProperties } from "./elementResourceClient";

import { testPipelines } from "./test";

export {
  PipelineEditor,
  Pipeline,
  reducer,
  fetchPipeline,
  fetchElements,
  fetchElementProperties,
  searchPipelines,
  actionCreators,
  StoreState,
  testPipelines
};

export default PipelineEditor;
