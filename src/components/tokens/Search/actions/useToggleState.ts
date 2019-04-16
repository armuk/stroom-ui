import { useApi } from "../../api/";
import { useCallback } from "react";

const useToggleState = (toggleEnabled: Function) => {
  const { toggleState } = useApi();
  return useCallback(
    (tokenId: string, nextState: boolean) => {
      toggleState(tokenId, nextState).then(() => toggleEnabled(tokenId));
    },
    [toggleState],
  );
};

export default useToggleState;
