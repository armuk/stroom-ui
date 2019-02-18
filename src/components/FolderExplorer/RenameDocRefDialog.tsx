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
import { useState } from "react";

import { Formik, Field } from "formik";

import DialogActionButtons from "./DialogActionButtons";
import IconHeader from "../IconHeader";
import { useRenameDocument } from "./explorerClient";
import ThemedModal from "../ThemedModal";
import { required, minLength2 } from "../../lib/reduxFormUtils";
import { DocRefType } from "../../types";

export interface Props {
  isOpen: boolean;
  docRef?: DocRefType;
  onCloseDialog: () => void;
}

interface FormValues {
  docRefName: string;
}

let RenameDocRefDialog = ({ isOpen, docRef, onCloseDialog }: Props) => {
  const renameDocument = useRenameDocument();

  return (
    <Formik<FormValues>
      initialValues={{
        docRefName: !!docRef && !!docRef.name ? docRef.name : ""
      }}
      onSubmit={values => {
        if (!!docRef) {
          renameDocument(docRef, values.docRefName);
        }
        onCloseDialog();
      }}
    >
      {({ submitForm }) => (
        <ThemedModal
          isOpen={isOpen}
          header={<IconHeader icon="edit" text="Enter New Name for Doc Ref" />}
          content={
            <form>
              <label>Type</label>
              <Field
                name="docRefName"
                type="text"
                placeholder="Name"
                validate={[required, minLength2]}
              />
            </form>
          }
          actions={
            <DialogActionButtons
              onCancel={onCloseDialog}
              onConfirm={submitForm}
            />
          }
        />
      )}
    </Formik>
  );
};

/**
 * These are the things returned by the custom hook that allow the owning component to interact
 * with this dialog.
 */
export type UseDialog = {
  /**
   * The owning component is ready to start a deletion process.
   * Calling this will open the dialog, and setup the UUIDs
   */
  showDialog: (docRef: DocRefType) => void;
  /**
   * These are the properties that the owning component can just give to the Dialog component
   * using destructing.
   */
  componentProps: Props;
};

/**
 * This is a React custom hook that sets up things required by the owning component.
 */
export const useDialog = (): UseDialog => {
  const [docRef, setDocRef] = useState<DocRefType | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return {
    componentProps: {
      docRef,
      isOpen,
      onCloseDialog: () => {
        setIsOpen(false);
        setDocRef(undefined);
      }
    },
    showDialog: _docRef => {
      setIsOpen(true);
      setDocRef(_docRef);
    }
  };
};

export default RenameDocRefDialog;
