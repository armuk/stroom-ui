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
import * as uuidv4 from "uuid/v4";

import {
  getPipelineAsTree,
  getBinItems,
  createNewElementInPipeline,
  reinstateElementToPipeline,
  removeElementFromPipeline,
  getAllChildren,
  setElementPropertyValueInPipeline,
  getParentProperty,
  revertPropertyToParent,
  revertPropertyToDefault,
} from "./pipelineUtils";

import { keyByType } from "./elementUtils";

import { testPipelines, elements } from "src/testing/data/pipelines";
import {
  PipelineDocumentType,
  PipelinePropertyType,
  PipelinePropertyValue,
} from "src/components/DocumentEditors/useDocumentApi/types/pipelineDoc";
import { PipelineAsTreeType } from "./AddElementModal/types";
import { DocRefType } from "src/components/DocumentEditors/useDocumentApi/types/base";

const elementsByType = keyByType(elements);

function expectsForSimplePipeline(asTree: PipelineAsTreeType) {
  expect(asTree.uuid).toBe("Source");
  expect(asTree.children[0].uuid).toBe("dsParser");
  expect(asTree.children[0].children[0].uuid).toBe("xsltFilter");
  expect(asTree.children[0].children[0].children[0].uuid).toBe("xmlWriter");
  expect(asTree.children[0].children[0].children[0].children[0].uuid).toBe(
    "streamAppender",
  );
}

function expectsForGetDescendants(children: string[]) {
  expect(children.includes("xmlWriter1")).toBeTruthy();
  expect(children.includes("xmlWriter2")).toBeTruthy();
  expect(children.includes("streamAppender1")).toBeTruthy();
  expect(children.includes("streamAppender2")).toBeTruthy();
}

function expectsForNewProperties(
  properties: PipelinePropertyType[],
  expectedSize: number,
  elementName: string,
  propertyName: string,
  propertyValue: any,
) {
  expect(properties.length).toEqual(expectedSize);
  const property = properties.find(
    element => element.element === elementName && element.name == propertyName,
  );
  expect(property).toBeDefined();
  expect(property!.element).toEqual(elementName);
  expect(property!.name).toEqual(propertyName);
  expect(property!.value).toEqual(propertyValue);
}

describe("Pipeline Utils", () => {
  describe("#getPipelineAsTree", () => {
    test("should convert a simple pipeline to a tree", () => {
      // When
      const asTree: PipelineAsTreeType | undefined = getPipelineAsTree(
        testPipelines.simple,
      );

      // Then
      expect(asTree).toBeDefined();
      expectsForSimplePipeline(asTree!);
    });
    test("should convert a multi branch child pipeline to a tree", () => {
      // When
      const asTree = getPipelineAsTree(testPipelines.multiBranchChild);

      // Then
      expect(asTree).toBeDefined();
      //console.log('Multi Branch Child', JSON.stringify(asTree, null, 2));
    });
    test("should convert a pipeline to a tree and detect the correct root", () => {
      // Given
      // Swap some entities over -- it shouldn't matter if they're not in the correct order
      const testPipeline: PipelineDocumentType = {
        type: "Pipeline",
        uuid: uuidv4(),
        name: "Test Pipeline",
        configStack: testPipelines.simple.configStack,
        merged: {
          ...testPipelines.simple.merged,
          links: {
            add: [...testPipelines.simple.merged.links.add!],
          },
        },
      };
      const first = testPipeline.merged.links.add![0];
      expect(first).toBeDefined();
      testPipeline.merged.links.add![0] = testPipeline.merged.links.add![2];
      testPipeline.merged.links.add![2] = first;

      // When
      const asTree = getPipelineAsTree(testPipeline);

      // Then
      expect(asTree).toBeDefined();
      expectsForSimplePipeline(asTree!);
    });

    test("should convert a pipeline to a single node tree -- tests edge case of no links", () => {
      // When
      const asTree = getPipelineAsTree(testPipelines.singleElement);

      // Then
      expect(asTree).toBeDefined();
      expect(asTree!.uuid).toBe("Source");
    });
  });

  describe("#getAllChildren", () => {
    test("should recursively return children #1", () => {
      // When
      const children = getAllChildren(
        testPipelines.forkedPipeline,
        "xsltFilter",
      );

      // Then
      expect(children.length).toBe(4);
      expectsForGetDescendants(children);
    });
    test("should recursively return children #2", () => {
      // When
      const children = getAllChildren(testPipelines.forkedPipeline, "dsParser");

      // Then
      expect(children.length).toBe(5);
      expectsForGetDescendants(children);
      expect(children.includes("xsltFilter")).toBeTruthy();
    });
    test("should recursively return children #3", () => {
      // When
      const children = getAllChildren(
        testPipelines.forkedPipeline,
        "xmlWriter1",
      );

      // Then
      expect(children.length).toBe(1);
      expect(children.includes("streamAppender1")).toBeTruthy();
    });
  });

  describe("#createNewElementInPipeline", () => {
    test("should add item to merged and config stack", () => {
      // Given
      const testPipeline = testPipelines.simple;
      const elementDefinition = elements.find(f => f.type === "XSLTFilter")!;
      const newElementName = "New XSLT Filter";
      const parentId = "dsParser";

      // When
      const updatedPipeline = createNewElementInPipeline(testPipeline, {
        parentId,
        elementDefinition,
        name: newElementName,
      });

      // Then
      const arrayContainingElement = expect.arrayContaining([
        {
          id: newElementName,
          type: elementDefinition.type,
        },
      ]);
      const arrayContainingLink = expect.arrayContaining([
        {
          from: parentId,
          to: newElementName,
        },
      ]);

      expect(updatedPipeline.configStack[0].elements.add).toEqual(
        arrayContainingElement,
      );
      expect(updatedPipeline.configStack[0].links.add).toEqual(
        arrayContainingLink,
      );

      expect(updatedPipeline.merged.elements.add).toEqual(
        arrayContainingElement,
      );
      expect(updatedPipeline.merged.links.add).toEqual(arrayContainingLink);
    });
  });

  describe("#setElementPropertyValueInPipeline", () => {
    test("should update a property on an element in the config stack", () => {
      // Given
      const testPipeline: PipelineDocumentType = Object.assign(
        testPipelines.simple,
        {},
      );
      const elementName = "xsltFilter";
      const propertyName = "xslt";
      const propertyType = "entity";
      const propertyDocRefValue: DocRefType = {
        type: "some type",
        uuid: "some uuid",
        name: "some name",
      };

      // When
      const updatedPipeline: PipelineDocumentType = setElementPropertyValueInPipeline(
        testPipeline,
        elementName,
        propertyName,
        propertyType,
        propertyDocRefValue,
      );

      // Then
      const propertyValue: PipelinePropertyValue = {
        boolean: null,
        entity: propertyDocRefValue,
        integer: null,
        long: null,
        string: null,
      };
      const stackAdd: PipelinePropertyType[] = updatedPipeline.configStack[0]
        .properties.add!;
      expectsForNewProperties(
        stackAdd,
        2,
        elementName,
        propertyName,
        propertyValue,
      );
      const mergedAdd = updatedPipeline.merged.properties.add;
      expect(mergedAdd).toBeDefined();
      expectsForNewProperties(
        mergedAdd!,
        2,
        elementName,
        propertyName,
        propertyValue,
      );
    });

    test("should add a property to an element in the config stack", () => {
      // Given
      const testPipeline = Object.assign(testPipelines.simple, {});
      const elementName = "xsltFilter";
      const propertyName = "xsltNamePattern";
      const propertyType = "string";
      const propertyDocRefValue = "New value";

      // When
      const updatedPipeline = setElementPropertyValueInPipeline(
        testPipeline,
        elementName,
        propertyName,
        propertyType,
        propertyDocRefValue,
      );

      // Then
      const propertyValue = {
        boolean: null,
        entity: null,
        integer: null,
        long: null,
        string: propertyDocRefValue,
      };
      const stackAdd = updatedPipeline.configStack[0].properties.add;
      expect(stackAdd).toBeDefined();
      expectsForNewProperties(
        stackAdd!,
        3,
        elementName,
        propertyName,
        propertyValue,
      );
      const mergedAdd = updatedPipeline.merged.properties.add;
      expect(mergedAdd).toBeDefined();
      expectsForNewProperties(
        mergedAdd!,
        3,
        elementName,
        propertyName,
        propertyValue,
      );
    });
  });

  describe("#revertPropertyToParent", () => {
    test("should remove an item from the add stack", () => {
      // Given
      const testPipeline = testPipelines.childWithProperty;
      const elementName = "xsltFilter";
      const propertyName = "xsltNamePattern";
      const matchingProp = (addItem: PipelinePropertyType) =>
        addItem.element === elementName && addItem.name === propertyName;

      // Verify that the test data is as we expect
      const parentTestConfirmation = testPipeline.configStack[0].properties.add!.find(
        matchingProp,
      )!;
      expect(parentTestConfirmation.value.string).toBe("DSD");
      const childTestConfirmation = testPipeline.configStack[1].properties.add!.find(
        matchingProp,
      )!;
      expect(childTestConfirmation.value.string).toBe("D");
      const mergedTestConfirmation = testPipeline.merged.properties.add!.find(
        matchingProp,
      )!;
      expect(mergedTestConfirmation.value.string).toBe("D");

      // When
      const updatedPipeline = revertPropertyToParent(
        testPipeline,
        elementName,
        propertyName,
      );

      // Then
      const parentProperty: PipelinePropertyType = updatedPipeline.configStack[0].properties.add!.find(
        matchingProp,
      )!;
      expect(parentProperty.value.string).toBe("DSD");

      const shouldBeNullChildProperty: PipelinePropertyType = updatedPipeline.configStack[1].properties.add!.find(
        matchingProp,
      )!;
      expect(shouldBeNullChildProperty).toBe(undefined);

      const mergedProperty: PipelinePropertyType | undefined =
        updatedPipeline.merged.properties.add &&
        updatedPipeline.merged.properties.add.find(matchingProp);
      expect(mergedProperty).toBeDefined();
      expect(mergedProperty!.value.string).toBe("DSD");
    });

    test("to error when there's no parent in the stack", () => {
      // Given
      const testPipeline = testPipelines.noParent;
      const elementName = "xsltFilter";
      const propertyName = "xsltNamePattern";

      // When
      expect(() =>
        revertPropertyToParent(testPipeline, elementName, propertyName),
      ).toThrow();
    });
  });

  describe("#revertPropertyToDefault", () => {
    test("should remove an item from the parent by adding a remove -- child has property", () => {
      // Given
      const testPipeline = testPipelines.childWithProperty;
      const elementName = "xsltFilter";
      const propertyName = "xsltNamePattern";
      const matchingProp = (addItem: PipelinePropertyType) =>
        addItem.element === elementName && addItem.name === propertyName;

      // Verify that the test data is as we expect
      const parentTestConfirmation = testPipeline.configStack[0].properties.add!.find(
        matchingProp,
      );
      expect(parentTestConfirmation).toBeDefined();
      expect(parentTestConfirmation!.value.string).toBe("DSD");
      const childTestConfirmation = testPipeline.configStack[1].properties.add!.find(
        matchingProp,
      );
      expect(childTestConfirmation!.value.string).toBe("D");
      const mergedTestConfirmation = testPipeline.merged.properties.add!.find(
        matchingProp,
      );
      expect(mergedTestConfirmation!.value.string).toBe("D");

      // When
      const updatedPipeline = revertPropertyToDefault(
        testPipeline,
        elementName,
        propertyName,
      );

      // Then
      // We expect the paret to be unchanged
      const parentProperty: PipelinePropertyType | undefined =
        updatedPipeline.configStack[0].properties.add &&
        updatedPipeline.configStack[0].properties.add!.find(matchingProp);
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.value.string).toBe("DSD");

      // We expect the add in the child to have been removed/not exist
      const shouldBeNullChildProperty = updatedPipeline.configStack[1].properties.add!.find(
        matchingProp,
      );
      expect(shouldBeNullChildProperty).toBe(undefined);

      // We expect there to be a remove in the child config stack
      const shouldBeFoundInRemove = updatedPipeline.configStack[1].properties.remove!.find(
        matchingProp,
      );
      expect(shouldBeFoundInRemove).toBeDefined();
      expect(shouldBeFoundInRemove!.value.string).toBe("D");

      // We expect there to be no such property in the merged add list
      const mergedProperty =
        updatedPipeline.merged.properties.add &&
        updatedPipeline.merged.properties.add.find(matchingProp);
      expect(mergedProperty).toBe(undefined);
    });

    test("should remove an item from the parent by adding a remove - child doesn't have property", () => {
      // Given
      const testPipeline = testPipelines.emptyChildParentWithProperty;
      const elementName = "xsltFilter";
      const propertyName = "xsltNamePattern";
      const matchingProp = (addItem: PipelinePropertyType) =>
        addItem.element === elementName && addItem.name === propertyName;

      // Verify that the test data is as we expect
      const parentTestConfirmation = testPipeline.configStack[0].properties.add!.find(
        matchingProp,
      );
      expect(parentTestConfirmation).toBeDefined();
      expect(parentTestConfirmation!.value.string).toBe("DSD");

      const childTestConfirmation = testPipeline.configStack[1].properties.add!.find(
        matchingProp,
      );
      expect(childTestConfirmation).toBe(undefined);

      const mergedTestConfirmation = testPipeline.merged.properties.add!.find(
        matchingProp,
      );
      expect(mergedTestConfirmation).toBeDefined();
      expect(mergedTestConfirmation!.value.string).toBe("D");

      // When
      const updatedPipeline = revertPropertyToDefault(
        testPipeline,
        elementName,
        propertyName,
      );

      // Then
      // We expect the paret to be unchanged
      const parentProperty = updatedPipeline.configStack[0].properties.add!.find(
        matchingProp,
      );
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.value.string).toBe("DSD");

      // We expect the add in the child to have been removed/not exist
      const shouldBeNullChildProperty = updatedPipeline.configStack[1].properties.add!.find(
        matchingProp,
      );
      expect(shouldBeNullChildProperty).toBe(undefined);

      // We expect there to be a remove in the child config stack
      const shouldBeFoundInRemove = updatedPipeline.configStack[1].properties.remove!.find(
        matchingProp,
      );
      expect(shouldBeFoundInRemove).toBeDefined();
      expect(shouldBeFoundInRemove!.value.string).toBe("DSD");

      // We expect there to be no such property in the merged add list
      const mergedProperty = updatedPipeline.merged.properties.add!.find(
        matchingProp,
      );
      expect(mergedProperty).toBe(undefined);
    });
  });

  describe("#reinstateElementToPipeline", () => {
    test("it should restore an element and add a link to the correct parent", () => {
      // Given
      const testPipeline = testPipelines.forkRemoved;
      const parentId = "dsParser";
      const itemToReinstate = testPipelines.forkRemoved.configStack[0].elements
        .remove![0];

      // When
      const updatedPipeline = reinstateElementToPipeline(
        testPipeline,
        parentId,
        itemToReinstate,
      );
      const updatedConfigStackThis = updatedPipeline.configStack[0];

      // Then
      const expectedLink = {
        from: parentId,
        to: itemToReinstate.id,
      };

      expect(updatedConfigStackThis.elements.remove!.length).toBe(0);
      expect(updatedConfigStackThis.links.add).toEqual(
        expect.arrayContaining([expectedLink]),
      );
    });
  });

  describe("#removeElementFromPipeline", () => {
    test("should hide an element and link that are inherited", () => {
      // Given
      const testPipeline = testPipelines.inherited;
      const itemToDelete = "pXmlWriter";
      const configStackThis = testPipeline.configStack[1];

      // When
      const updatedPipeline = removeElementFromPipeline(
        testPipeline,
        itemToDelete,
      );
      const updatedConfigStackThis = updatedPipeline.configStack[1];

      // Then
      // Check merged - elements
      expect(
        testPipeline.merged.elements.add!.map(e => e.id).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();

      // Check merged - links
      expect(
        testPipeline.merged.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        updatedPipeline.merged.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();

      // Check config stack - elements
      expect(
        configStackThis.elements.add!.map(e => e.id).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        configStackThis.elements.remove!.map(e => e.id).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.elements
          .add!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.elements
          .remove!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeTruthy();

      // Check config stack - links
      expect(
        configStackThis.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        configStackThis.links.remove!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.links
          .remove!.map(l => l.to)
          .includes(itemToDelete),
      ).toBeTruthy();

      // Check that a follow on element & link are still just being added to merged picture
      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes("pStreamAppender"),
      ).toBeTruthy();
      expect(updatedPipeline.merged.links.add).toEqual(
        expect.arrayContaining([
          {
            from: "pXmlWriter",
            to: "pStreamAppender",
          },
        ]),
      );
    });
    test("should hide an element that is inherited, but delete a link that is ours", () => {
      // Given
      const testPipeline = testPipelines.childRestoredLink;
      const itemToDelete = "xsltFilter"; // is a parent element, but the link was restored to an element we created
      const itemToDeleteParent = "xmlParser"; // this is our element which we restored the parent element onto
      const itemToDeleteChild = "xmlWriter"; // this is the element that are deleted element used as an output

      // When
      const updatedPipeline = removeElementFromPipeline(
        testPipeline,
        itemToDelete,
      );

      // Then
      // Check merged elements
      expect(
        updatedPipeline.merged.elements
          .remove!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();

      // Check merged links
      const testLink = [
        {
          from: itemToDeleteParent,
          to: itemToDelete,
        },
      ];
      expect(testPipeline.merged.links.add).toEqual(
        expect.arrayContaining(testLink),
      );
      expect(updatedPipeline.merged.links.add).not.toEqual(
        expect.arrayContaining(testLink),
      );

      const testFollowOnLink = [
        {
          from: itemToDelete,
          to: itemToDeleteChild,
        },
      ];
      expect(testPipeline.merged.links.add).toEqual(
        expect.arrayContaining(testFollowOnLink),
      );
      expect(updatedPipeline.merged.links.add).toEqual(
        expect.arrayContaining(testFollowOnLink),
      );

      // Check merged elements
      expect(
        testPipeline.merged.elements.add!.map(e => e.id).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        testPipeline.merged.elements
          .add!.map(e => e.id)
          .includes(itemToDeleteChild),
      ).toBeTruthy();

      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes(itemToDeleteChild),
      ).toBeTruthy();
    });
    test("should be able to get a pipeline as a tree after deletion", () => {
      // Given
      const testPipeline = testPipelines.multiBranchChild;
      const itemToDelete = "xmlWriter1";

      // When
      const updatedPipeline = removeElementFromPipeline(
        testPipeline,
        itemToDelete,
      );
      const updatedConfigStackThis = updatedPipeline.configStack[1];

      const asTree = getPipelineAsTree(updatedPipeline);
      const recycleBin = getBinItems(updatedPipeline, elementsByType);

      expect(updatedConfigStackThis).toBeDefined();
      expect(asTree).toBeDefined();
      expect(recycleBin).toBeDefined();
    });
    test("should hide an element that is ours, and delete the link", () => {
      // Given
      const testPipeline = testPipelines.simple;
      const itemToDelete = "xmlWriter";
      const configStackThis = testPipeline.configStack[0];

      // When
      const updatedPipeline = removeElementFromPipeline(
        testPipeline,
        itemToDelete,
      );
      const updatedConfigStackThis = updatedPipeline.configStack[0];

      // Then
      // Check merged - elements
      expect(
        testPipeline.merged.elements.add!.map(e => e.id).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();

      // Check merged - links
      expect(
        testPipeline.merged.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        updatedPipeline.merged.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();

      // Check Config Stack - elements
      expect(
        configStackThis.elements.add!.map(e => e.id).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        configStackThis.elements.remove!.map(e => e.id).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.elements
          .add!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.elements
          .remove!.map(e => e.id)
          .includes(itemToDelete),
      ).toBeTruthy();

      // Check Config stack - links
      expect(
        configStackThis.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeTruthy();
      expect(
        configStackThis.links.remove!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.links.add!.map(l => l.to).includes(itemToDelete),
      ).toBeFalsy();
      expect(
        updatedConfigStackThis.links
          .remove!.map(l => l.to)
          .includes(itemToDelete),
      ).toBeFalsy();

      // Check that a follow on element & link are still just being added to merged picture
      expect(
        updatedPipeline.merged.elements
          .add!.map(e => e.id)
          .includes("streamAppender"),
      ).toBeTruthy();
      expect(updatedPipeline.merged.links.add).toEqual(
        expect.arrayContaining([
          {
            from: "xmlWriter",
            to: "streamAppender",
          },
        ]),
      );
    });
  });

  describe("#getParentProperty", () => {
    test("shouldn't find anything because there's no parent", () => {
      // Given
      const pipeline = testPipelines.noParent;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "xsltNamePattern",
      );

      // Then
      expect(parentProperty).toBe(undefined);
    });

    test("shouldn't find anything because there's nothing in the parent", () => {
      // Given
      const pipeline = testPipelines.childNoProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "combinedParser",
        "type",
      );
      // Then
      expect(parentProperty).toBe(undefined);
    });
    test("should find parent property", () => {
      // Given
      const pipeline = testPipelines.childWithProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "combinedParser",
        "type",
      );
      const parentProperty2 = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "xsltNamePattern",
      );

      // Then
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.element).toBe("combinedParser");
      expect(parentProperty!.name).toBe("type");
      expect(parentProperty!.value.string).toBe("JS");

      expect(parentProperty2).toBeDefined();
      expect(parentProperty2!.element).toBe("xsltFilter");
      expect(parentProperty2!.name).toBe("xsltNamePattern");
      expect(parentProperty2!.value.string).toBe("DSD");
    });

    test("shouldn' find a property in parent or parent's parent", () => {
      // Given
      const pipeline = testPipelines.childNoPropertyParentNoProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "combinedParser",
        "type",
      );
      // Then
      expect(parentProperty).toBe(undefined);
    });

    test("should find a property, in the parent's parent", () => {
      // Given
      const pipeline = testPipelines.childNoPropertyParentWithProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "property1",
      );
      // Then
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.element).toBe("xsltFilter");
      expect(parentProperty!.name).toBe("property1");
      expect(parentProperty!.value.boolean).toBe(false);
    });

    test("should find a property, in the parent but not their parent", () => {
      // Given
      const pipeline = testPipelines.childWithPropertyParentNoProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "property1",
      );
      // Then
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.element).toBe("xsltFilter");
      expect(parentProperty!.name).toBe("property1");
      expect(parentProperty!.value.boolean).toBe(false);
    });

    test("should find a property in the parent and ignore a property in their parent", () => {
      // Given
      const pipeline = testPipelines.childWithPropertyParentWithProperty;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "xsltNamePattern",
      );
      // Then
      expect(parentProperty).toBeDefined();
      expect(parentProperty!.element).toBe("xsltFilter");
      expect(parentProperty!.name).toBe("xsltNamePattern");
      expect(parentProperty!.value.string).toBe("DSD");
    });

    test("shouldn't find a property in the parent because although it's there it also exists in 'remove'", () => {
      // Given
      const pipeline = testPipelines.childWithRemoveForItsParentsAdd;
      // When
      const parentProperty = getParentProperty(
        pipeline.configStack,
        "xsltFilter",
        "property2",
      );
      // Then
      expect(parentProperty).toBe(undefined);
    });
  });
});
