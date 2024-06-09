import { Config } from "sst/node/config";
import { z } from "zod";

const stages = ['dev', 'prod',] as const;
export type stages = typeof stages[number];

const sstEnvSchema = z.object({
	AUTH_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),
	STAGE: z.enum(stages),
	APP: z.literal('beaconhost-website'),
});
// zod or sst (idk which) doesn't like parsing `Config` as is. It is a proxy object so shallow cloning works fine here
const sstEnv = sstEnvSchema.parse({ ...Config });

const localEnvSchema = z.object({
	PROD_AUTH_URL: z.string().url().optional(),
	STAGE: z.enum(stages).optional(),
}).refine((obj) => obj.STAGE !== 'prod' || obj.PROD_AUTH_URL, "Stage is prod, PROD_AUTH_URL must be set");
const localEnv = localEnvSchema.parse(process.env);

if (localEnv.STAGE && localEnv.STAGE !== sstEnv.STAGE)
	throw new Error(`sst STAGE=${sstEnv.STAGE} and env STAGE=${localEnv.STAGE} which are not equal`);

const env = { ...sstEnv, ...localEnv };

export default env;