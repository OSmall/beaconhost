import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import env from "@/lib/env";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const dbClient = DynamoDBAdapter(DynamoDBDocument.from(new DynamoDB({})), {
	tableName: `${env.STAGE}-${env.APP}-next-auth`
});

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
	adapter: dbClient,
	trustHost: true,
	secret: env.AUTH_SECRET,
});