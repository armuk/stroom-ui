import { HttpRequest, HttpResponse } from "@pollyjs/adapter-fetch";

import { TestCache } from "../PollyDecorator";
import { Config } from "../../../startup/config";
import { ResourceBuilder } from "./resourceBuilder";

const resourceBuilder: ResourceBuilder = (
  server: any,
  testConfig: Config,
  testCache: TestCache
) => {
  const resource = `${testConfig.stroomBaseServiceUrl}/xslt/v1/`;
  server
    .get(`${resource}/:xsltUuid`)
    .intercept((req: HttpRequest, res: HttpResponse) => {
      const xslt = testCache.data!.xslt[req.params.xsltUuid];
      if (xslt) {
        res.setHeader("Content-Type", "application/xml");
        res.send(xslt);
      } else {
        res.sendStatus(404);
      }
    });
  server
    .post(`${resource}/:xsltUuid`)
    .intercept((req: HttpRequest, res: HttpResponse) => {
      testCache.data!.xslt[req.params.xsltUuid].data = req.body;
      res.sendStatus(200);
    });
};

export default resourceBuilder;