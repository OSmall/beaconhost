import { SSTConfig } from "sst";
import { Config, NextjsSite, Table } from "sst/constructs";
import { stages } from "@/lib/env"

const profile: string = "beaconhost-sandbox";

export default {
  config(input) {
    return {
      name: "beaconhost-website",
      region: "ap-southeast-2",
      profile: profile
      // profile: input.stage ? { prod: "beaconhost-prod", dev: "beaconhost-sandbox" }[input.stage as stages] : "beaconhost-sandbox",
    };
  },
  stacks(app) {
    if (profile === "beaconhost-sandbox") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(function Site({ stack }) {
      const AUTH_SECRET = new Config.Secret(stack, "AUTH_SECRET");
      const GITHUB_ID = new Config.Secret(stack, "GITHUB_ID");
      const GITHUB_SECRET = new Config.Secret(stack, "GITHUB_SECRET");

      const authTable = new Table(stack, "next-auth", {
        fields: {
          pk: "string",
          sk: "string",
          GSI1PK: "string",
          GSI1SK: "string",
        },
        primaryIndex: {
          partitionKey: "pk",
          sortKey: "sk",
        },
        timeToLiveAttribute: "expires",
        globalIndexes: {
          GSI1: {
            partitionKey: "GSI1PK",
            sortKey: "GSI1SK",
          }
        }
      });

      const site = new NextjsSite(stack, "beaconhost", {
        bind: [
          AUTH_SECRET,
          GITHUB_ID,
          GITHUB_SECRET,
          authTable,
        ],
        environment: {
          AUTH_URL: { dev: "", prod: process.env.PROD_AUTH_URL! }[app.stage as stages],
          DEBUG: "typedorm:*",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
