import * as uuidv4 from "uuid/v4";
import { PipelineDocumentType } from "src/api/useDocumentApi/types/pipelineDoc";

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
export default {
  uuid: uuidv4(),
  name: "Single Element",
  type: "Pipeline",
  description: "Pipeline with a single element",
  configStack: [
    {
      elements: {
        add: [],
        remove: [],
      },
      properties: {
        add: [],
        remove: [],
      },
      pipelineReferences: {
        add: [],
        remove: [],
      },
      links: {
        add: [],
        remove: [],
      },
    },
  ],
  merged: {
    elements: {
      add: [
        {
          id: "Source",
          type: "Source",
        },
      ],
      remove: [],
    },
    properties: {
      add: [],
      remove: [],
    },
    pipelineReferences: {
      add: [],
      remove: [],
    },
    links: {
      add: [],
      remove: [],
    },
  },
} as PipelineDocumentType;
