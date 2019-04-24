/*
 * Copyright 2018 Crown Copyright
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

import IconHeader from "../../../IconHeader";
import DialogActionButtons from "../../../DialogActionButtons";
import ThemedModal from "../../../ThemedModal";
import AppSearchBar from "../../../AppSearchBar";
import PermissionInheritancePicker from "../PermissionInheritancePicker";
import useForm from "lib/useForm";
import { UseDialog, Props } from "./types";
import { DocRefType } from "components/DocumentEditors/useDocumentApi/types/base";
import { PermissionInheritance } from "../PermissionInheritancePicker/types";

interface FormValues {
  destination?: DocRefType;
  permissionInheritance: PermissionInheritance;
}

export const CopyMoveDocRefDialog: React.FunctionComponent<Props> = ({
  uuids,
  initialDestination,
  isOpen,
  onConfirm,
  onCloseDialog,
}) => {
  const initialValues = React.useMemo<FormValues>(
    () => ({
      permissionInheritance: PermissionInheritance.NONE,
      destination: initialDestination,
    }),
    [initialDestination],
  );

  const {
    value: { destination, permissionInheritance },
    useControlledInputProps,
  } = useForm<FormValues>({
    initialValues,
  });

  const destinationProps = useControlledInputProps<DocRefType>("destination");
  const permissionInheritanceProps = useControlledInputProps<
    PermissionInheritance
  >("permissionInheritance");

  const onConfirmLocal = React.useCallback(() => {
    if (!!destination && !!permissionInheritance) {
      onConfirm(uuids, destination, permissionInheritance);
      onCloseDialog();
    } else {
      console.error("Destination or Permission Inheritance Missing", {
        destination,
        permissionInheritance,
      });
    }
  }, [destination, permissionInheritance, uuids, onConfirm, onCloseDialog]);

  return (
    <ThemedModal
      isOpen={isOpen}
      header={
        <IconHeader
          icon="copy"
          text="Select a Destination Folder for the Copy"
        />
      }
      content={
        <form>
          <div>
            <label>Destination</label>
            <AppSearchBar {...destinationProps} typeFilters={[]} />
          </div>
          <div>
            <label>Permission Inheritance</label>
            <PermissionInheritancePicker {...permissionInheritanceProps} />
          </div>
        </form>
      }
      actions={
        <DialogActionButtons
          onCancel={onCloseDialog}
          onConfirm={onConfirmLocal}
        />
      }
    />
  );
};

export const useDialog = (
  onConfirm: (
    uuids: string[],
    destination: DocRefType,
    permissionInheritance: PermissionInheritance,
  ) => void,
): UseDialog => {
  const [initialDestination, setInitialDestination] = React.useState<
    DocRefType | undefined
  >(undefined);
  const [uuidsToCopy, setUuidToCopy] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return {
    componentProps: {
      onConfirm,
      uuids: uuidsToCopy,
      initialDestination,
      isOpen,
      onCloseDialog: () => {
        setIsOpen(false);
        setUuidToCopy([]);
        setInitialDestination(undefined);
      },
    },
    showDialog: (_uuids, _destination) => {
      setIsOpen(true);
      setUuidToCopy(_uuids);
      setInitialDestination(_destination);
    },
  };
};
