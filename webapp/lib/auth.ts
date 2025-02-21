import env from "@/lib/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { createElectroDbService, ElectroDBAdapter } from "./orm/ElectroDBAdapter";

export const dynamoDbClient = new DynamoDBClient({
	endpoint: env.STAGE === "local" ? "http://localhost:8000" : undefined,
});
export const AuthService = createElectroDbService(dynamoDbClient, `beaconhost-${env.STAGE}`);
const electroDbAdapter = ElectroDBAdapter(AuthService);

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
