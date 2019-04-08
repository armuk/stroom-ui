import * as React from "react";

import useApi from "./useApi";
import { IndexVolume } from "./types";

/**
 * Convenience function for using Index Volume.
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseIndexVolumes {
  indexVolumes: IndexVolume[];
  createIndexVolume: (nodeName: string, path: string) => void;
  deleteIndexVolume: (id: string) => void;
  addVolumeToGroup: (indexVolumeId: string, groupName: string) => void;
}

interface ReceiveAction {
  type: "received";
  indexVolumes: IndexVolume[];
}
interface DeleteAction {
  type: "deleted";
  id: string;
}
interface CreateAction {
  type: "created";
  indexVolume: IndexVolume;
}

const reducer = (
  state: IndexVolume[],
  action: ReceiveAction | DeleteAction | CreateAction,
): IndexVolume[] => {
  switch (action.type) {
    case "received":
      return action.indexVolumes;
    case "created":
      return state.concat([action.indexVolume]);
    case "deleted":
      return state.filter(v => v.id !== action.id);
  }

  return state;
};

const useIndexVolumes = (): UseIndexVolumes => {
  const [indexVolumes, dispatch] = React.useReducer(reducer, []);

  const {
    getIndexVolumes,
    deleteIndexVolume,
    addVolumeToGroup,
    createIndexVolume,
  } = useApi();

  React.useEffect(() => {
    getIndexVolumes().then(v =>
      dispatch({
        type: "received",
        indexVolumes: v,
      }),
    );
  }, [dispatch, getIndexVolumes]);

  return {
    indexVolumes,
    createIndexVolume: React.useCallback(
      (nodeName: string, path: string) =>
        createIndexVolume(nodeName, path).then(indexVolume =>
          dispatch({
            type: "created",
            indexVolume,
          }),
        ),
      [createIndexVolume],
    ),
    deleteIndexVolume: React.useCallback(
      (id: string) =>
        deleteIndexVolume(id).then(() =>
          dispatch({
            type: "deleted",
            id,
          }),
        ),
      [deleteIndexVolume],
    ),
    addVolumeToGroup: React.useCallback(
      (volumeId: string, groupName: string) =>
        addVolumeToGroup(volumeId, groupName),
      [addVolumeToGroup],
    ),
  };
};

export default useIndexVolumes;
