import { DataRow } from "src/types";

export interface FetchDataParams {
  metaId?: number;
  pageSize: number;
  pageOffset: number;
}

export interface PagedData {
  streamAttributeMaps: DataRow[];
  total: number;
}

export interface UseData {
  pagedData: PagedData;
  updatePagedData: (updates: Partial<PagedData>) => void;
  fetchParams: FetchDataParams;
  updateFetchParams: (updates: Partial<FetchDataParams>) => void;
  getDataForSelectedRow: () => void;
}
