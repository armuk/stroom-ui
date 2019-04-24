import { useCallback, useEffect } from "react";
import { useApi } from "../api";
import { User } from "../types";
import { useUserSearchState } from "./useUserSearchState";

interface UserSearchApi {
  users: User[];
  selectedUser: string;
  remove: (userId: string) => void;
  changeSelectedUser: (userId: string) => void;
}

const useUserSearch = (): UserSearchApi => {
  const {
    users,
    selectedUser,
    setSelectedUser,
    setUsers,
  } = useUserSearchState();
  const { search } = useApi();

  useEffect(() => {
    search().then(users => {
      setUsers(users);
    });
  }, [search, setUsers]);

  const { remove: removeUserUsingApi } = useApi();

  const remove = useCallback(
    (userId: string) => {
      removeUserUsingApi(userId).then(() =>
        search().then(users => setUsers(users)),
      );
    },
    [removeUserUsingApi, search, setUsers],
  );

  const changeSelectedUser = useCallback(
    (userId: string) => {
      setSelectedUser(userId);
    },
    [setSelectedUser],
  );

  return {
    users,
    selectedUser,
    remove,
    changeSelectedUser,
  };
};

export default useUserSearch;
