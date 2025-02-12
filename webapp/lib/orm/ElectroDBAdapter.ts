import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";


export function ElectroDBAdapter(dynamoDbClient: DynamoDBClient): Adapter {
	
	let adapterUser: AdapterUser = {
		id: "id",
		email: "email",
		emailVerified: null,
	}

	let adapterSession: AdapterSession = {
		sessionToken: "sessionToken",
		userId: "sessionToken",
		expires: new Date(),
	}

	return {
		async createUser(user: AdapterUser) {
			return user;
		},
		async getUser(id: string) {
			return null;
		},
		async getUserByEmail(email: string) {
			return null;
		},
		async getUserByAccount(providerAccountId) {
			return null;
		},
		async updateUser(user) {
			return adapterUser;
		},
		async deleteUser(userId: string) {
			return adapterUser;
		},
		async linkAccount(account: AdapterAccount) {
			return null;
		},
		async unlinkAccount(providerAccountId) {
			return;
		},
		async createSession(session: {
			sessionToken: string
			userId: string
			expires: Date
		}) {
			return adapterSession;
		},
		async getSessionAndUser(sessionToken: string) {
			return null;
		},
		async updateSession(session) {
			return null;
		},
		async deleteSession(sessionToken: string) {
			return null;
		},
		async createVerificationToken(verificationToken) {
			return null;
		},
		async useVerificationToken(params: {
			identifier: string
			token: string
		}) {
			return null;
		},
	}
}
