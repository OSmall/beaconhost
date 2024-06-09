import 'reflect-metadata';
import { INDEX_TYPE, Table } from "@typedorm/common";
import { createConnection } from "@typedorm/core";
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import env from "@/lib/env";
import User from './user.entity';
import Session from './session.entity';
import Account from './account.entity';

const table = new Table({
	name: `${env.STAGE}-${env.APP}-next-auth`,
	partitionKey: 'pk',
	sortKey: 'sk',
	indexes: {
		GSI1: {
			type: INDEX_TYPE.GSI,
			partitionKey: 'GSI1PK',
			sortKey: 'GSI1SK',
		}
	}
});

const documentClient = new DocumentClientV3(new DynamoDB({}));

export const authConnection = createConnection({
	name: 'auth',
	table,
	entities: 
	[
		User, Session, Account
	],
	documentClient,
});