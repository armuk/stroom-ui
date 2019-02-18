import * as React from "react";

import { DropTarget, DropTargetSpec, DropTargetCollector } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ElementCategory from "./ElementCategory";
import { getBinItems } from "../pipelineUtils";
import { DragDropTypes, DropCollectedProps } from "../dragDropTypes";
import { ElementDefinition } from "../../../types";
import usePipelineState from "../redux/usePipelineState";
import useElements from "../redux/useElements";
import Loader from "../../../components/Loader";

export interface Props {
  pipelineId: string;
  showDeleteElementDialog: (elementId: string) => void;
}

export interface EnhancedProps extends Props, DropCollectedProps {}

const dropTarget: DropTargetSpec<Props> = {
  canDrop(props, monitor) {
    return true;
  },
  drop({ showDeleteElementDialog }, monitor) {
    const { elementId } = monitor.getItem();
    showDeleteElementDialog(elementId);
  }
};

const dropCollect: DropTargetCollector<DropCollectedProps> = (
  connect,
  monitor
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  draggingItemType: monitor.getItemType(),
  canDrop: monitor.canDrop()
});

const enhance = DropTarget<Props, DropCollectedProps>(
  [DragDropTypes.ELEMENT],
  dropTarget,
  dropCollect
);

const ElementPalette = ({
  pipelineId,
  connectDropTarget,
  draggingItemType,
  isOver
}: EnhancedProps) => {
  const pipelineState = usePipelineState(pipelineId);
  const elements = useElements();

  if (!(pipelineState && elements)) {
    return <Loader message="Loading Pipeline and Elements" />;
  }

  const binColour = isOver ? "red" : "black";
  const { byCategory, byType } = elements;
  const recycleBinItems =
    pipelineState && pipelineState.pipeline
      ? getBinItems(pipelineState.pipeline, byType)
      : [];

  return connectDropTarget(
    <div className="element-palette">
      {draggingItemType === DragDropTypes.ELEMENT ? (
        <div className="Pipeline-editor__bin">
          <FontAwesomeIcon icon="trash" size="lg" color={binColour} />
        </div>
      ) : (
        <React.Fragment>
          <ElementCategory category="Bin" elementsWithData={recycleBinItems} />
          {Object.entries(byCategory).map(k => (
            <ElementCategory
              key={k[0]}
              category={k[0]}
              elementsWithData={k[1].map((e: ElementDefinition) => ({
                element: e
              }))}
            />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default enhance(ElementPalette);
