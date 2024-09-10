import env from "@/lib/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity } from "electrodb";

const table = `${env.STAGE}-${env.APP}-next-auth`;
export const client = new DynamoDBClient({});

export const Session = new Entity({
	model: {
		entity: "session",
		version: "1",
		service: "beaconhost",
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
			readOnly: true,
		},
		type: {
			type: ["SESSION"],
			readOnly: true,
		}
	},
	indexes: {
		byUser: {
			pk: {
				field: "pk",
				composite: ["userId"],
				template: "USER#${userId}",
				casing: "none",
			},
			sk: {
				field: "sk",
				composite: ["sessionToken"],
				template: "SESSION#${sessionToken}",
				casing: "none",
			},
		},
		bySessionToken: {
			index: "GSI1",
			pk: {
				field: "GSI1PK",
				composite: ["sessionToken"],
				template: "SESSION#${sessionToken}",
				casing: "none",
			},
			sk: {
				field: "GSI1SK",
				composite: ["sessionToken"],
				template: "SESSION#${sessionToken}",
				casing: "none",
			},
		}
	},
}, { table, client });


export const User = new Entity({
	model: {
		entity: "user",
		version: "1",
		service: "beaconhost",
	},
	attributes: {
		id: {
			type: "string",
			readOnly: true,
		},
		email: {
			type: "string",
			readOnly: true,
		},
		emailVerified: {
			type: "boolean",
			readOnly: true,
		},
		image: {
			type: "string",
			readOnly: true,
		},
		name: {
			type: "string",
			readOnly: true,
		},
		type: {
			type: ["USER"],
			readOnly: true,
		}
	},
	indexes: {
		byId: {
			pk: {
				field: "pk",
				composite: ["id"],
				template: "USER#${id}",
				casing: "none",
			},
			sk: {
				field: "sk",
				composite: ["id"],
				template: "USER#${id}",
				casing: "none",
			},
		},
		byEmail: {
			index: "GSI1",
			pk: {
				field: "GSI1PK",
				composite: ["email"],
				template: "USER#${email}",
				casing: "none",
			},
			sk: {
				field: "GSI1SK",
				composite: ["email"],
				template: "USER#${email}",
				casing: "none",
			},
		}
	}
}, { table, client });

export const Account = new Entity({
	model: {
		entity: "account",
		version: "1",
		service: "beaconhost",
	},
	attributes: {
		id: {
			type: "string",
			readOnly: true,
		},
		userId: {
			type: "string",
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
			readOnly: true,
		},
		tokenType: {
			type: "string",
			readOnly: true,
			field: "token_type",
		},
		accessToken: {
			type: "string",
			readOnly: true,
			field: "access_token",
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
				template: "USER#${userId}",
				casing: "none",
			},
			sk: {
				field: "sk",
				composite: ["provider", "providerAccountId"],
				template: "ACCOUNT#${provider}#${providerAccountId}",
				casing: "none",
			},
		},
		byProvider: {
			index: "GSI1",
			pk: {
				field: "GSI1PK",
				composite: ["provider"],
				template: "ACCOUNT#${provider}",
				casing: "none",
			},
			sk: {
				field: "GSI1SK",
				composite: ["providerAccountId"],
				template: "ACCOUNT#${providerAccountId}",
				casing: "none",
			},
		}
	}
}, { table, client })