import env from "@/lib/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { createElectroDbEntities, ElectroDBAdapter } from "./orm/ElectroDBAdapter";

export const dynamoDbClient = new DynamoDBClient({
	endpoint: "http://localhost:8000",
});
export const AuthEntities = createElectroDbEntities(dynamoDbClient, `beaconhost-${env.STAGE}`);
const electroDbAdapter = ElectroDBAdapter(AuthEntities);

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	providers: [
		GitHub({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
	],
	adapter: electroDbAdapter,
	trustHost: true,
	secret: env.AUTH_SECRET,
});
