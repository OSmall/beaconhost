import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { Entity, EntityItem } from "electrodb";
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";

const service: string = "beaconhost";

export function createElectroDbEntities(client: DynamoDBClient, table: string) {
	const user = new Entity({
		model: {
			entity: "user",
			version: "1",
			service,
		},
		attributes: {
			id: {
				type: "string",
				required: true,
				readOnly: true,
				default: () => randomUUID(),
			},
			email: {
				type: "string",
				required: true,
			},
			emailVerified: {
				type: "string",
			},
			image: {
				type: "string",
			},
			name: {
				type: "string",
			},
		},
		indexes: {
			byId: {
				index: undefined,
				pk: {
					field: "pk",
					composite: ["id"],
				},
				sk: {
					field: "sk",
					composite: ["id"],
				},
			},
			byEmail: {
				index: "GSI1",
				pk: {
					field: "GSI1PK",
					composite: ["email"],
				},
				sk: {
					field: "GSI1SK",
					composite: ["email"],
				},
			}
		}
	}, { table, client });

	const account = new Entity({
		model: {
			entity: "account",
			version: "1",
			service,
		},
		attributes: {
			id: {
				type: "string",
				required: true,
				readOnly: true,
				default: () => randomUUID(),
			},
			userId: {
				type: "string",
				required: true,
				readOnly: true,
			},
			provider: {
				type: "string",
				readOnly: true,
			},
			providerAccountId: {
				type: "string",
				readOnly: true,
			},
			scope: {
				type: "string",
			},
			tokenType: {
				type: "string",
				readOnly: true,
			},
			accessToken: {
				type: "string",
				readOnly: true,
			},
			type: {
				type: "string",
				readOnly: true,
			},
		},
		indexes: {
			byUser: {
				pk: {
					field: "pk",
					composite: ["userId"],
				},
				sk: {
					field: "sk",
					composite: ["provider", "providerAccountId"],
				},
			},
			byProvider: {
				index: "GSI1",
				pk: {
					field: "GSI1PK",
					composite: ["provider"],
				},
				sk: {
					field: "GSI1SK",
					composite: ["providerAccountId"],
				},
			}
		}
	}, { table, client });

	const session = new Entity({
		model: {
			entity: "session",
			version: "1",
			service,
		},
		attributes: {
			sessionToken: {
				type: "string",
				readOnly: true,
			},
			userId: {
				type: "string",
				readOnly: true,
			},
			expires: {
				type: "number",
			},
		},
		indexes: {
			byUser: {
				pk: {
					field: "pk",
					composite: ["userId"],
				},
				sk: {
					field: "sk",
					composite: ["sessionToken"],
				},
			},
			bySessionToken: {
				index: "GSI1",
				pk: {
					field: "GSI1PK",
					composite: ["sessionToken"],
				},
				sk: {
					field: "GSI1SK",
					composite: ["sessionToken"],
				},
			}
		},
	}, { table, client });

	const verificationToken = new Entity({
		model: {
			entity: "verificationToken",
			version: "1",
			service,
		},
		attributes: {
			identifier: {
				type: "string",
				readOnly: true,
			},
			token: {
				type: "string",
				readOnly: true,
			},
			expires: {
				type: "number",
				readOnly: true,
			},
			userId: {
				type: "string",
				readOnly: true,
			},
		},
		indexes: {
			byUserId: {
				pk: {
					field: "pk",
					composite: ["userId"],
				},
				sk: {
					field: "sk",
					composite: ["expires"],
				},
			},
			byIdentifierAndToken: {
				index: "GSI1",
				pk: {
					field: "GSI1PK",
					composite: ["identifier"],
				},
				sk: {
					field: "GSI1SK",
					composite: ["token"],
				},
			},
		}
	});

	return { user, account, session, verificationToken };
}

export function ElectroDBAdapter(entities: ReturnType<typeof createElectroDbEntities>): Adapter {

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

	const formatUser = {
		to(electroUser: AdapterUser): EntityItem<typeof entities.user> {
			return {
				...electroUser,
				emailVerified: electroUser.emailVerified?.toISOString(),
				image: electroUser.image ?? undefined,
				name: electroUser.name ?? undefined,
			}
		},
		from(dbUser: EntityItem<typeof entities.user>): AdapterUser {
			return {
				...dbUser,
				emailVerified: dbUser.emailVerified ? new Date(dbUser.emailVerified) : null,
			}
		},
	}

	return {
		async createUser(user: AdapterUser) {
			const res = await entities.user.create(formatUser.to(user)).go();
			return formatUser.from(res.data);
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
