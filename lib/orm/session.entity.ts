import 'reflect-metadata';
import { Attribute, Entity, INDEX_TYPE } from "@typedorm/common";

@Entity({
	name: 'session', // name of the entity that will be added to each item as an attribute
	primaryKey: {
		partitionKey: 'USER#{{userId}}',
		sortKey: 'SESSION#{{sessionToken}}',
	},
	indexes: {
		GSI1: {
			partitionKey: 'SESSION#{{sessionToken}}',
			sortKey: 'SESSION#{{sessionToken}}',
			type: INDEX_TYPE.GSI,
		},
	},
})
export class User {
	@Attribute({
		unique: true
	})
	sessionToken!: string;

	@Attribute()
	expires!: number;

	@Attribute()
	userId!: string;

	@Attribute()
	type!: "SESSION";
}