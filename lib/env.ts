import { Config } from "sst/node/config";
import { z } from "zod";


const schema = z.object({
	AUTH_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),
	STAGE: z.enum(['dev', 'prod',]),
	APP: z.literal('beacon-host-website'),
});

const env = schema.parse({ ...Config }); // zod or sst (idk which) doesn't like parsing `Config` as is. It is a proxy objext so shallow cloning works fine here

export default env;