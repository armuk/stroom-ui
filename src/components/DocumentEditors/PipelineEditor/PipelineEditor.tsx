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
import PanelGroup from "react-panelgroup";

import Loader from "components/Loader";
import AddElementModal, {
  useDialog as useAddElementDialog,
} from "./AddElementModal/AddElementModal";
import PipelineSettings, {
  useDialog as usePipelineSettingsDialog,
} from "./PipelineSettings/PipelineSettings";
import ElementPalette from "./ElementPalette";
import DeletePipelineElement, {
  useDialog as useDeleteElementDialog,
} from "./DeletePipelineElement";
import { ElementDetails } from "./ElementDetails";
import PipelineDisplay from "./PipelineDisplay";
import DocRefEditor from "../DocRefEditor";
import { SwitchedDocRefEditorProps } from "../DocRefEditor/types";
import usePipelineState from "./usePipelineState";
import { ButtonProps } from "components/Button/types";

const PipelineEditor = ({ docRefUuid }: SwitchedDocRefEditorProps) => {
  const piplineStateProps = usePipelineState(docRefUuid);
  const {
    pipelineEditApi,
    useEditorProps: { editorProps },
  } = piplineStateProps;
  const { docRefContents: pipeline } = editorProps;

  const {
    settingsUpdated,
    elementAdded,
    elementDeleted,
    selectedElementId,
  } = pipelineEditApi;

  const {
    showDialog: showSettingsDialog,
    componentProps: settingsComponentProps,
  } = usePipelineSettingsDialog(settingsUpdated);

  const {
    showDialog: showAddElementDialog,
    componentProps: addElementComponentProps,
  } = useAddElementDialog(elementAdded);

  const {
    showDialog: showDeleteElementDialog,
    componentProps: deleteElementComponentProps,
  } = useDeleteElementDialog(elementIdToDelete => {
    elementDeleted(elementIdToDelete);
  });

  const onClickOpenSettings = React.useCallback(() => {
    if (!!pipeline) {
      showSettingsDialog({ description: pipeline.description || "something" });
    } else {
      console.error("No pipeline set");
    }
  }, [showSettingsDialog, pipeline]);

  const additionalActionBarItems: ButtonProps[] = [
    {
      icon: "cogs",
      title: "Open Settings",
      onClick: onClickOpenSettings,
    },
    {
      icon: "recycle",
      title: "Create Child Pipeline",
      onClick: () =>
        console.log("TODO - Implement Selection of Parent Pipeline"),
    },
  ];

  if (!pipeline) {
    return <Loader message="Loading pipeline..." />;
  }

  return (
    <DocRefEditor
      {...editorProps}
      additionalActionBarItems={additionalActionBarItems}
    >
      <div className="Pipeline-editor">
        <AddElementModal {...addElementComponentProps} />
        <DeletePipelineElement {...deleteElementComponentProps} />
        <PipelineSettings {...settingsComponentProps} />
        <div className="Pipeline-editor__element-palette">
          <ElementPalette
            pipeline={pipeline}
            showDeleteElementDialog={showDeleteElementDialog}
          />
        </div>

        <PanelGroup
          direction="column"
          className="Pipeline-editor__content"
          panelWidths={[
            {},
            {
              resize: "dynamic",
              size: selectedElementId !== undefined ? "50%" : 0,
            },
          ]}
        >
          <div className="Pipeline-editor__topPanel">
            <PipelineDisplay
              pipelineId={docRefUuid}
              pipelineStateProps={piplineStateProps}
              showAddElementDialog={showAddElementDialog}
            />
          </div>
          {selectedElementId !== undefined ? (
            <ElementDetails
              pipeline={pipeline}
              pipelineEditApi={pipelineEditApi}
            />
          ) : (
            <div />
          )}
        </PanelGroup>
      </div>
    </DocRefEditor>
  );
};

export default PipelineEditor;
