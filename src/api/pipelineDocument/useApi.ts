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
import { useActionCreators as useDocRefActionCreators } from "../../components/DocRefEditor";
import useHttpClient from "../useHttpClient";
import {
  PipelineModelType,
  PipelineSearchCriteriaType,
  PipelineSearchResultType
} from "../../types";
import { useCallback } from "react";
import { useConfig } from "../../startup/config";

interface Api {
  fetchPipeline: (pipelineId: string) => void;
  savePipeline: (document: PipelineModelType) => void;
  searchPipelines: (
    fetchParams: PipelineSearchCriteriaType
  ) => Promise<PipelineSearchResultType>;
}

export const useApi = (): Api => {
  const { stroomBaseServiceUrl } = useConfig();
  const { httpGetJson, httpPostEmptyResponse } = useHttpClient();
  const {
    documentReceived,
    documentSaveRequested,
    documentSaved
  } = useDocRefActionCreators();

  return {
    fetchPipeline: useCallback(
      (pipelineId: string) => {
        httpGetJson(`${stroomBaseServiceUrl}/pipelines/v1/${pipelineId}`).then(
          (pipeline: PipelineModelType) =>
            documentReceived(pipelineId, pipeline)
        );
      },
      [stroomBaseServiceUrl, httpGetJson]
    ),
    savePipeline: useCallback(
      (document: PipelineModelType) => {
        documentSaveRequested(document.docRef.uuid);
        httpPostEmptyResponse(
          `${stroomBaseServiceUrl}/pipelines/v1/${document.docRef.uuid}`,
          { body: JSON.stringify(document) }
        ).then(() => documentSaved(document.docRef.uuid));
      },
      [stroomBaseServiceUrl, httpPostEmptyResponse, documentSaveRequested]
    ),
    searchPipelines: useCallback(
      ({ filter, pageSize, pageOffset }: PipelineSearchCriteriaType) => {
        let url = `${stroomBaseServiceUrl}/pipelines/v1/?`;

        if (filter !== undefined && filter !== "") {
          url += `&filter=${filter}`;
        }

        if (pageSize !== undefined && pageOffset !== undefined) {
          url += `&pageSize=${pageSize}&offset=${pageOffset}`;
        }

        const forceGet = true;
        return httpGetJson(url, {}, forceGet);
      },
      [stroomBaseServiceUrl, httpGetJson]
    )
  };
};

export default useApi;
