import 'reflect-metadata';
import { INDEX_TYPE, Table } from "@typedorm/common";
import env from "@/lib/env";

const authTable = new Table({
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