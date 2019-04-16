import * as uuidv4 from "uuid/v4";
import { PipelineDocumentType } from "src/components/DocumentEditors/useDocumentApi/types/pipelineDoc";

export default {
  uuid: uuidv4(),
  name: "Forked Pipeline",
  type: "Pipeline",
  description:
    "This demonstrates a pipeline that heads in multiple directions to test layout",
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
            id: "xmlWriter1",
            type: "XMLWriter",
          },
          {
            id: "streamAppender1",
            type: "StreamAppender",
          },
          {
            id: "xmlWriter2",
            type: "XMLWriter",
          },
          {
            id: "streamAppender2",
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
        add: [
          {
            element: "dsParser",
            name: "textConverter",
            value: {
              string: null,
              integer: null,
              entity: {
                type: "TextConverter",
                uuid: "4fde9c79-796c-4069-bbdb-e707ff558376",
                name: "My CSV Splitter",
              },
              long: null,
              boolean: null,
            },
          },
          {
            element: "xsltFilter",
            name: "xslt",
            value: {
              string: null,
              integer: null,
              entity: {
                type: "XSLT",
                uuid: "5871080f-b5bb-49d2-9483-5a54f7fb4e7c",
                name: "MyXSLT",
              },
              long: null,
              boolean: null,
            },
          },
        ],
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
            to: "xmlWriter1",
          },
          {
            from: "xmlWriter1",
            to: "streamAppender1",
          },
          {
            from: "xsltFilter",
            to: "xmlWriter2",
          },
          {
            from: "xmlWriter2",
            to: "streamAppender2",
          },
        ],
        remove: [],
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
          id: "streamAppender1",
          type: "StreamAppender",
        },
        {
          id: "xmlWriter1",
          type: "XMLWriter",
        },
        {
          id: "streamAppender2",
          type: "StreamAppender",
        },
        {
          id: "xmlWriter2",
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
      add: [
        {
          element: "xsltFilter",
          name: "xslt",
          value: {
            string: null,
            integer: null,
            entity: {
              type: "XSLT",
              uuid: "5871080f-b5bb-49d2-9483-5a54f7fb4e7c",
              name: "MyXSLT",
            },
            long: null,
            boolean: null,
          },
        },
        {
          element: "dsParser",
          name: "textConverter",
          value: {
            string: null,
            integer: null,
            entity: {
              type: "TextConverter",
              uuid: "4fde9c79-796c-4069-bbdb-e707ff558376",
              name: "My CSV Splitter",
            },
            long: null,
            boolean: null,
          },
        },
      ],
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
          to: "xmlWriter1",
        },
        {
          from: "xsltFilter",
          to: "xmlWriter2",
        },
        {
          from: "xmlWriter1",
          to: "streamAppender1",
        },
        {
          from: "xmlWriter2",
          to: "streamAppender2",
        },
        {
          from: "dsParser",
          to: "xsltFilter",
        },
        {
          from: "Source",
          to: "dsParser",
        },
      ],
      remove: [],
    },
  },
} as PipelineDocumentType;
