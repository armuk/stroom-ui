import * as uuidv4 from "uuid/v4";
import * as loremIpsum from "lorem-ipsum";
import { DictionaryDoc } from "src/api/useDocumentApi/types/dictionaryDoc";

export const generate = (): DictionaryDoc => ({
  type: "DictionaryDoc",
  uuid: uuidv4(),
  name: loremIpsum({ count: 2, units: "words" }),
  description: loremIpsum({ count: 6, units: "words" }),
  data: Array(10)
    .fill(null)
    .map(() => loremIpsum({ count: 1, units: "words" }))
    .join("\n"),
  imports: [],
});
