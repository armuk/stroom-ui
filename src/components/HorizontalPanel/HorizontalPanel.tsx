import * as React from "react";
import * as Mousetrap from "mousetrap";

import Button from "../Button";
import { ButtonAppearance } from "components/Button/types";

interface Props {
  title: React.ReactNode;
  headerMenuItems?: React.ReactNode;
  content: React.ReactNode;
  onClose: (a?: any) => any;
  className?: string;
}

const HorizontalPanel: React.FunctionComponent<Props> = ({
  title,
  headerMenuItems,
  content,
  onClose,
  className,
}) => {
  React.useEffect(() => {
    Mousetrap.bind("esc", () => onClose());

    return () => {
      Mousetrap.unbind("esc");
    };
  }, [onClose]);

  return (
    <div className={`horizontal-panel ${className || ""}`}>
      <div className="horizontal-panel__header flat">
        <div className="horizontal-panel__header__title">{title}</div>
        {headerMenuItems}
        <Button
          appearance={ButtonAppearance.Icon}
          icon="times"
          onClick={() => onClose()}
        />
      </div>
      <div className="horizontal-panel__content">{content}</div>
    </div>
  );
};

export default HorizontalPanel;
