import * as React from "react";

import { DropdownOptionProps } from "./types";

interface WithClassName {
  className: string;
}

interface Props extends DropdownOptionProps, WithClassName {}

export const DefaultDropdownOption = ({
  option,
  className,
  onClick
}: Props) => (
  <div className={className} onClick={onClick}>
    {option.text}
  </div>
);

let DefaultDropdownOption2 = ({
  option,
  inFocus,
  onClick
}: DropdownOptionProps) => {
  let classNames = ["hoverable"];

  if (inFocus) classNames.push("inFocus");

  const className = classNames.join(" ");

  return (
    <div className={className} onClick={onClick}>
      {option.text}
    </div>
  );
};
export default DefaultDropdownOption2;
