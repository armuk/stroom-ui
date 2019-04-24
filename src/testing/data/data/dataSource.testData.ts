import { DataSourceType } from "components/ExpressionBuilder/types";

export default {
  fields: [
    {
      type: "FIELD",
      name: "feedName",
      queryable: true,
      conditions: ["EQUALS", "CONTAINS"],
    },
  ],
} as DataSourceType;
