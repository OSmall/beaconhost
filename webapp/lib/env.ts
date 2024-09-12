import { z } from "zod";

const stages = ['dev', 'prod',] as const;
export type stages = typeof stages[number];

const localEnvSchema = z.object({
	APP: z.literal('beaconhost-website'),
	AUTH_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),
	STAGE: z.enum(stages).optional(),
})
const env = localEnvSchema.parse(process.env);

export default env;