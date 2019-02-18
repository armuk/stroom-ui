import * as uuidv4 from "uuid/v4";
import * as loremIpsum from "lorem-ipsum";

import { XsltDoc } from "../../../types";
import bitmapReference from "./bitmap-reference";

export const generateTestXslt = (): XsltDoc => ({
  type: "XSLT",
  uuid: uuidv4(),
  name: loremIpsum({ count: 2, units: "words" }),
  description: loremIpsum({ count: 6, units: "words" }),
  data: bitmapReference
});

export default generateTestXslt;
