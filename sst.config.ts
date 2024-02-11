import { SSTConfig } from "sst";
import { Config, NextjsSite, Table } from "sst/constructs";
import env from "./lib/env";

export default {
  config(_input) {
    return {
      name: "beacon-host-website",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const AUTH_SECRET = new Config.Secret(stack, "AUTH_SECRET");
      const GITHUB_ID = new Config.Secret(stack, "GITHUB_ID");
      const GITHUB_SECRET = new Config.Secret(stack, "GITHUB_SECRET");


      const userTable = new Table(stack, "user", {
        fields: {
          id: "string",
          email: "string",
        },
        primaryIndex: { partitionKey: "id" },
      });

      const site = new NextjsSite(stack, "beaconhost", {
        bind: [
          AUTH_SECRET,
          GITHUB_ID,
          GITHUB_SECRET,
          userTable,
        ],
        environment: {
          AUTH_URL: { dev: undefined, prod: process.env.PROD_AUTH_URL }[app.stage] as string,
        }
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
