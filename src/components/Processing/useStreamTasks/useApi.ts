import * as React from "react";

import useHttpClient from "src/lib/useHttpClient";
import { StreamTasksResponseType } from "src/types";

import { FetchParameters } from "./types";
import { useConfig } from "src/startup/config";

interface Api {
  fetchTrackers: (params: FetchParameters) => Promise<StreamTasksResponseType>;
  fetchMore: (params: FetchParameters) => Promise<StreamTasksResponseType>;
  setEnabled: (filterId: number, enabled: boolean) => Promise<void>;
}

export const useApi = (): Api => {
  const { stroomBaseServiceUrl } = useConfig();
  const { httpGetJson, httpPatchEmptyResponse } = useHttpClient();

  const fetchTrackers = React.useCallback(
    ({
      pageSize,
      pageOffset,
      sortBy,
      sortDirection,
      searchCriteria,
    }: FetchParameters): Promise<StreamTasksResponseType> => {
      let url = `${stroomBaseServiceUrl}/streamtasks/v1/?`;
      url += `pageSize=${pageSize}`;
      url += `&offset=${pageOffset}`;
      if (sortBy !== undefined) {
        url += `&sortBy=${sortBy}`;
        url += `&sortDirection=${sortDirection}`;
      }

      if (searchCriteria !== "" && searchCriteria !== undefined) {
        url += `&filter=${searchCriteria}`;
      }

      return httpGetJson(url);
    },
    [stroomBaseServiceUrl, httpGetJson],
  );

  const fetchMore = React.useCallback(
    ({
      pageSize,
      pageOffset,
      sortBy,
      sortDirection,
      searchCriteria,
    }: FetchParameters): Promise<StreamTasksResponseType> => {
      const nextPageOffset = pageOffset + 1;

      let url = `${stroomBaseServiceUrl}/streamtasks/v1/?`;
      url += `pageSize=${pageSize}`;
      url += `&offset=${nextPageOffset}`;
      if (sortBy !== undefined) {
        url += `&sortBy=${sortBy}`;
        url += `&sortDirection=${sortDirection}`;
      }

      if (searchCriteria !== "" && searchCriteria !== undefined) {
        url += `&filter=${searchCriteria}`;
      }

      return httpGetJson(url);
    },
    [stroomBaseServiceUrl, httpGetJson],
  );

  const setEnabled = React.useCallback(
    (filterId: number, enabled: boolean) => {
      const url = `${stroomBaseServiceUrl}/streamtasks/v1/${filterId}`;
      const body = JSON.stringify({
        op: "replace",
        path: "enabled",
        value: enabled,
      });

      return httpPatchEmptyResponse(url, { body });
    },
    [stroomBaseServiceUrl, httpPatchEmptyResponse],
  );

  return {
    setEnabled,
    fetchMore,
    fetchTrackers,
  };
};

export default useApi;

// TODO: This isn't currently used.
// const getRowsPerPage = (isDetailsVisible) => {
//   const viewport = document.getElementById('table-container');
//   let rowsInViewport = 20; // Fallback default
//   const headerHeight = 46;
//   const footerHeight = 36;
//   // const detailsHeight = 295;
//   const rowHeight = 30;
//   if (viewport) {
//     const viewportHeight = viewport.offsetHeight;
//     const heightAvailableForRows = viewportHeight - headerHeight - footerHeight;
//     // if (isDetailsVisible) {
//     // heightAvailableForRows -= detailsHeight;
//     // }
//     rowsInViewport = Math.floor(heightAvailableForRows / rowHeight);
//   }

//   // Make sure we always request at least 1 row, even if the viewport is too small
//   // to display it without scrolling. Anything less will be rejected by the
//   // service for being rediculous.
//   if (rowsInViewport <= 0) {
//     return 1;
//   }
//   return rowsInViewport;
// };
