import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {randomUUID} from "crypto";
import {Entity, EntityItem, Service} from "electrodb";
import {Adapter, AdapterAccount, AdapterSession, AdapterUser} from "next-auth/adapters";

const service: string = "beaconhost";

export function createElectroDbService(client: DynamoDBClient, table: string) {
	const User = new Entity({
		model: {
			entity: "user",
			version: "1",
			service,
		},
		attributes: {
			userId: {
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
				collection: "byUserId",
				index: undefined,
				pk: {
					field: "pk",
					composite: ["userId"],
				},
				sk: {
					field: "sk",
					composite: ["userId"],
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

	const Account = new Entity({
		model: {
			entity: "account",
			version: "1",
			service,
		},
		attributes: {
			accountId: {
				label: "id",
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
				collection: "byUserId",
				index: undefined,
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

	const Session = new Entity({
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
				collection: "byUserId",
				index: undefined,
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

	const VerificationToken = new Entity({
		model: {
			entity: "vt",
			version: "1",
			service,
		},
		attributes: {
			identifier: {
				label: "id",
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
		},
		indexes: {
			byIdentifierAndToken: {
				index: undefined,
				pk: {
					field: "pk",
					composite: ["identifier"],
				},
				sk: {
					field: "sk",
					composite: ["token"],
				},
			},
		}
	});

	return new Service({ User, Account, Session, VerificationToken });
}

export function ElectroDBAdapter(Service: ReturnType<typeof createElectroDbService>): Adapter {

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

	const { entities, collections, transaction } = Service;

	const formatUser = {
		to<T extends Partial<AdapterUser>>(electroUser: T) {
			return {
				...electroUser,
				emailVerified: electroUser.emailVerified?.toISOString(),
				image: electroUser.image ?? undefined,
				name: electroUser.name ?? undefined,
			}
		},
		from(dbUser: EntityItem<typeof entities.User>): AdapterUser {
			return {
				...dbUser,
				id: dbUser.userId,
				emailVerified: dbUser.emailVerified ? new Date(dbUser.emailVerified) : null,
			}
		},
	}

	return {
		async createUser(user: AdapterUser) {
			const res = await entities.User.create(formatUser.to(user)).go();
			return formatUser.from(res.data);
		},
		async getUser(userId: string) {
			const response = await entities.User.get({ userId }).go();
			const user = response.data;
			return user ? formatUser.from(user) : null;
		},
		async getUserByEmail(email: string) {
			const response = await entities.User.query.byEmail({ email }).go();
			const user = response.data[0];
			return user ? formatUser.from(user) : null;
		},
		async getUserByAccount({ provider, providerAccountId }) {
			const accountResponse = await entities.Account.query
				.byProvider({ provider, providerAccountId }).go();
			const account = accountResponse.data[0];
			const userResponse = await entities.User.get({ userId: account.userId }).go();
			const user = userResponse.data;
			return user ? formatUser.from(user) : null;
		},
		async updateUser(user) {
			const response = await entities.User
				.patch({ userId: user.id })
				.set(formatUser.to(user))
				.go({ response: "all_new" });
			let dbUser = response.data;
			return formatUser.from(dbUser);
		},
		async deleteUser(userId: string) {
			const data = (await collections.byUserId({ userId }).go()).data;
			transaction.write(({ User, Account, Session }) => {
				const sessionDeletes = data.Session.map(session => Session.delete({
					userId,
					sessionToken: session.sessionToken
				}).commit());
				const accountDeletes = data.Account.map(account => Account.delete({
					userId,
					provider: account.provider,
					providerAccountId: account.providerAccountId
				}).commit());
				return [
					...sessionDeletes,
					...accountDeletes,
					User.delete({ userId }).commit({ response: "all_old" }),
				]
			})

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
