import { HttpRequest, HttpResponse } from "@pollyjs/adapter-fetch";

import { TestCache } from "../PollyDecorator";
import { Config } from "startup/config";
import { ResourceBuilder } from "./types";

const resourceBuilder: ResourceBuilder = (
  server: any,
  { userServiceUrl }: Config,
  testCache: TestCache,
) => {
  const resource = userServiceUrl;

  // Get all users
  server.get(resource).intercept((req: HttpRequest, res: HttpResponse) => {
    res.json(testCache.data!.users);
  });
  server
    .get(`${resource}/isPasswordValid`)
    .intercept((req: HttpRequest, res: HttpResponse) => {
      res.json(true);
    });
};

export default resourceBuilder;
