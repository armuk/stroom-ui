import * as React from "react";
import {
  DropTarget,
  DropTargetSpec,
  DropTargetCollector,
  DragSourceSpec,
  DragSourceCollector,
  DragSource,
} from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { canMove } from "lib/treeUtils/treeUtils";
import {
  DragDropTypes,
  DragObject,
  DragCollectedProps,
  DropCollectedProps,
} from "../DocumentEditors/FolderExplorer/types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { KeyDownState } from "lib/useKeyIsDown";
import { MenuItemOpened, MenuItemType, MenuItemsOpenState } from "./types";
import { DocRefType } from "components/DocumentEditors/useDocumentApi/types/base";

interface Props {
  className?: string;
  menuItem: MenuItemType;
  depth: number;
  isCollapsed?: boolean;
  selectedItems: MenuItemType[];
  focussedItem?: MenuItemType;
  keyIsDown: KeyDownState;
  areMenuItemsOpen: MenuItemsOpenState;
  menuItemOpened: MenuItemOpened;
  showCopyDialog: (docRefUuids: string[], destination: DocRefType) => void;
  showMoveDialog: (docRefUuids: string[], destination: DocRefType) => void;
}

interface EnhancedProps extends Props, DragCollectedProps, DropCollectedProps {}

const dropTarget: DropTargetSpec<Props> = {
  canDrop({ menuItem: { docRef } }, monitor) {
    const { docRefs } = monitor.getItem();

    return (
      !!docRef &&
      docRefs.reduce(
        (acc: boolean, curr: DocRefType) => acc && canMove(curr, docRef),
        true,
      )
    );
  },
  drop({ menuItem: { docRef }, showCopyDialog, showMoveDialog }, monitor) {
    const { docRefs, isCopy } = monitor.getItem();
    const docRefUuids = docRefs.map((d: DocRefType) => d.uuid);

    if (docRef) {
      if (isCopy) {
        showCopyDialog(docRefUuids, docRef);
      } else {
        showMoveDialog(docRefUuids, docRef);
      }
    }
  },
};

const dropCollect: DropTargetCollector<
  DropCollectedProps,
  Props
> = function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
};

const dragSource: DragSourceSpec<Props, DragObject> = {
  canDrag({ menuItem: { docRef } }) {
    return !!docRef;
  },
  beginDrag({ menuItem: { docRef }, keyIsDown: { Control, Meta } }) {
    return {
      docRefs: docRef ? [docRef] : [],
      isCopy: !!(Control || Meta),
    };
  },
};

const dragCollect: DragSourceCollector<
  DragCollectedProps,
  Props
> = function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const MenuItem: React.FunctionComponent<EnhancedProps> = ({
  menuItem,
  isOver,
  canDrop,
  className: rawClassName,
  areMenuItemsOpen,
  depth,
  connectDropTarget,
  connectDragSource,
  isCollapsed,
  selectedItems,
  menuItemOpened,
  focussedItem,
}) => {
  const isSelected: boolean = selectedItems
    .map((d: MenuItemType) => d.key)
    .includes(menuItem.key);
  const inFocus: boolean = !!focussedItem && focussedItem.key === menuItem.key;

  const onExpand: React.MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent,
  ) => {
    menuItemOpened(menuItem.key, !areMenuItemsOpen[menuItem.key]);
    e.preventDefault();
  };
  const onSelect: React.MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent,
  ) => {
    menuItem.onClick();
    e.preventDefault();
  };

  const classNames = [];

  if (rawClassName) {
    classNames.push(rawClassName);
  }

  classNames.push("sidebar__menu-item");
  classNames.push(menuItem.style);

  if (isOver) {
    classNames.push("dnd-over");
  }
  if (isOver) {
    if (canDrop) {
      classNames.push("can-drop");
    } else {
      classNames.push("cannot-drop");
    }
  }
  if (inFocus) {
    classNames.push("inFocus");
  }
  if (isSelected) {
    classNames.push("selected");
  }

  const hasChildren = menuItem.children && menuItem.children.length > 0;
  const isShowingChildren = areMenuItemsOpen[menuItem.key];
  if (hasChildren && isShowingChildren) {
    classNames.push("has-children--open");
  }

  if (menuItem.isActive) {
    classNames.push("is-active");
  }

  const style = { paddingLeft: `${depth * 0.7}rem` };
  const className = classNames.join(" ");

  const hasChildrenIcon = `folder${
    isShowingChildren ? "-open" : "-plus"
  }` as IconProp;
  //const isHeader = menuItem.key !== "stroom";

  return connectDragSource(
    connectDropTarget(
      <div onClick={onSelect} className={className} style={style}>
        {hasChildren ? (
          <div className="menu-item__menu-icon" onClick={onExpand}>
            <FontAwesomeIcon size="lg" icon={hasChildrenIcon} />
          </div>
        ) : (
          <div className="menu-item__menu-icon">
            <FontAwesomeIcon size="lg" icon={menuItem.icon} />
          </div>
        )}
        {isCollapsed ? (
          undefined
        ) : (
          <span onClick={onSelect} className="menu-item__text">
            {menuItem.title}
          </span>
        )}
      </div>,
    ),
  );
};

const enhance = (d: React.FunctionComponent<EnhancedProps>) =>
  DropTarget<Props>([DragDropTypes.DOC_REF_UUIDS], dropTarget, dropCollect)(
    DragSource<Props>(DragDropTypes.DOC_REF_UUIDS, dragSource, dragCollect)(d),
  );

const EnhancedMenuItem: React.FunctionComponent<Props> = enhance(MenuItem);

export default EnhancedMenuItem;
