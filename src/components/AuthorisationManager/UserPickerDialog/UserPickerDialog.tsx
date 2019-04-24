import * as React from "react";

import { BaseProps as UserPickerBaseProps } from "../UserPicker/types";
import UserPicker, { usePicker } from "../UserPicker";
import ThemedModal from "components/ThemedModal";
import IconHeader from "components/IconHeader";
import DialogActionButtons from "components/DialogActionButtons";

interface BaseProps {
  pickerBaseProps?: UserPickerBaseProps;
  onConfirm: (groupUuid: string) => void;
}

interface Props extends BaseProps {
  isOpen: boolean;
  setIsOpen: (i: boolean) => void;
}

export const UserPickerDialog: React.FunctionComponent<Props> = ({
  onConfirm,
  isOpen,
  pickerBaseProps = {},
  setIsOpen,
}) => {
  const { reset, pickerProps } = usePicker(pickerBaseProps);
  const { value: userGroupUuid } = pickerProps;

  const onClose = React.useCallback(() => {
    reset();
    setIsOpen(false);
  }, [reset, setIsOpen]);

  const onConfirmLocal = React.useCallback(() => {
    if (!!userGroupUuid) {
      onConfirm(userGroupUuid);
      onClose();
    }
  }, [onConfirm, onClose]);

  return (
    <ThemedModal
      isOpen={isOpen}
      header={<IconHeader icon="user" text="Choose User" />}
      content={
        <div>
          <UserPicker {...pickerProps} />
        </div>
      }
      actions={
        <DialogActionButtons onConfirm={onConfirmLocal} onCancel={onClose} />
      }
    />
  );
};

interface UseDialog {
  componentProps: Props;
  showDialog: () => void;
}

export const useDialog = (pickerBaseProps: BaseProps): UseDialog => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return {
    componentProps: {
      ...pickerBaseProps,
      isOpen,
      setIsOpen,
    },
    showDialog: () => setIsOpen(true),
  };
};

export default UserPickerDialog;
