import { Config } from "sst/node/config";
import { z } from "zod";

const stages = ['dev', 'prod',] as const;

const sstEnvSchema = z.object({
	AUTH_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),
	STAGE: z.enum(stages),
	APP: z.literal('beaconhost-website'),
});
const sstEnv = sstEnvSchema.parse({ ...Config }); // zod or sst (idk which) doesn't like parsing `Config` as is. It is a proxy objext so shallow cloning works fine here

const localEnvSchema = z.object({
	PROD_AUTH_URL: z.string().url().optional(),
	STAGE: z.enum(stages).optional(),
});
const localEnv = localEnvSchema.parse(process.env);

if (localEnv.STAGE !== undefined && localEnv.STAGE !== sstEnv.STAGE)
	throw new Error("sst STAGE and env STAGE are not equal");

const env = { ...sstEnv, ...localEnv };

export default env;