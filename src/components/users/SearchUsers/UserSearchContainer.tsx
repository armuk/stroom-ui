/*
 * Copyright 2017 Crown Copyright
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

import * as React from "react";
import "react-table/react-table.css";
import "react-toggle/style.css";
import useAppNavigation from "components/AppChrome/useAppNavigation";
import UserSearch from "./UserSearch";
import useUserSearch from "./useUserSearch";

const UserSearchContainer = () => {
  const { users, remove } = useUserSearch();
  const { goToNewUser, goToUser } = useAppNavigation();
  return (
    <UserSearch
      onNewUserClicked={goToNewUser}
      onUserOpen={goToUser}
      users={users}
      onDeleteUser={remove}
    />
  );
};

export default UserSearchContainer;
