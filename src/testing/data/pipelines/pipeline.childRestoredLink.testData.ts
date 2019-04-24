import * as uuidv4 from "uuid/v4";
import { PipelineDocumentType } from "components/DocumentEditors/useDocumentApi/types/pipelineDoc";

export default {
  uuid: uuidv4(),
  name: "Child Restored Link",
  type: "Pipeline",
  description: "This demonstrates a pipeline with a link that can be restored",
  configStack: [
    {
      elements: {
        add: [
          {
            id: "dsParser",
            type: "DSParser",
          },
          {
            id: "xsltFilter",
            type: "XSLTFilter",
          },
          {
            id: "xmlWriter",
            type: "XMLWriter",
          },
          {
            id: "streamAppender",
            type: "StreamAppender",
          },
          {
            id: "Source",
            type: "Source",
          },
        ],
        remove: [],
      },
      properties: {
        add: [],
        remove: [],
      },
      pipelineReferences: {
        add: [],
        remove: [],
      },
      links: {
        add: [
          {
            from: "Source",
            to: "dsParser",
          },
          {
            from: "dsParser",
            to: "xsltFilter",
          },
          {
            from: "xsltFilter",
            to: "xmlWriter",
          },
          {
            from: "xmlWriter",
            to: "streamAppender",
          },
        ],
        remove: [],
      },
    },
    {
      elements: {
        add: [
          {
            id: "xmlParser",
            type: "XMLParser",
          },
        ],
        remove: [],
      },
      properties: {
        add: [],
        remove: [],
      },
      pipelineReferences: {
        add: [],
        remove: [],
      },
      links: {
        add: [
          {
            from: "Source",
            to: "xmlParser",
          },
          {
            from: "xmlParser",
            to: "xsltFilter",
          },
        ],
        remove: [
          {
            from: "dsParser",
            to: "xsltFilter",
          },
        ],
      },
    },
  ],
  merged: {
    elements: {
      add: [
        {
          id: "xsltFilter",
          type: "XSLTFilter",
        },
        {
          id: "streamAppender",
          type: "StreamAppender",
        },
        {
          id: "xmlParser",
          type: "XMLParser",
        },
        {
          id: "xmlWriter",
          type: "XMLWriter",
        },
        {
          id: "dsParser",
          type: "DSParser",
        },
        {
          id: "Source",
          type: "Source",
        },
      ],
      remove: [],
    },
    properties: {
      add: [],
      remove: [],
    },
    pipelineReferences: {
      add: [],
      remove: [],
    },
    links: {
      add: [
        {
          from: "xsltFilter",
          to: "xmlWriter",
        },
        {
          from: "xmlParser",
          to: "xsltFilter",
        },
        {
          from: "xmlWriter",
          to: "streamAppender",
        },
        {
          from: "Source",
          to: "dsParser",
        },
        {
          from: "Source",
          to: "xmlParser",
        },
      ],
      remove: [],
    },
  },
} as PipelineDocumentType;
