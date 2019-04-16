import * as React from "react";

import useApi from "./useApi";
import { UseData, PagedData, FetchDataParams } from "../types";
import useUpdateableState from "src/lib/useUpdateableState";

const defaultPagedData: PagedData = {
  streamAttributeMaps: [],
  total: 0,
};

const defaultFetchParams: FetchDataParams = {
  metaId: undefined,
  pageOffset: 0,
  pageSize: 20,
};

const useData = (): UseData => {
  const { getDataForSelectedRow } = useApi();

  const { value: pagedData, update: updatePagedData } = useUpdateableState<
    PagedData
  >(defaultPagedData);
  const { value: fetchParams, update: updateFetchParams } = useUpdateableState<
    FetchDataParams
  >(defaultFetchParams);

  const getDataForSelectedRowWrapped = React.useCallback(() => {
    getDataForSelectedRow(fetchParams).then(d => {
      console.log("D", d);
      // setPagedData({
      //   streamAttributeMaps: d.
      // })
    });
  }, [fetchParams, getDataForSelectedRow]);

  return {
    pagedData,
    updatePagedData,
    fetchParams,
    updateFetchParams,
    getDataForSelectedRow: getDataForSelectedRowWrapped,
  };
};

export default useData;
