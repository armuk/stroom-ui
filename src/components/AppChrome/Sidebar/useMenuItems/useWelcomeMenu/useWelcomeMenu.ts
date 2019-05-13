import * as React from "react";
import { SubMenuProps } from "../types";
import { MenuItemType } from "../../MenuItem/types";

const useWelcomeMenu = ({
  navigateApp: { goToWelcome },
}: SubMenuProps): MenuItemType =>
  React.useMemo(
    () => ({
      key: "welcome",
      title: "Welcome",
      onClick: goToWelcome,
      icon: "home",
      style: "nav",
    }),
    [goToWelcome],
  );

export default useWelcomeMenu;
