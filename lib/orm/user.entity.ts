import 'reflect-metadata';
import { Attribute, Entity, INDEX_TYPE } from "@typedorm/common";

@Entity({
	name: 'user', // name of the entity that will be added to each item as an attribute
	primaryKey: {
		partitionKey: 'USER#{{id}}',
		sortKey: 'USER#{{id}}',
	},
	indexes: {
		GSI1: {
			partitionKey: 'USER#{{email}}',
			sortKey: 'USER#{{email}}',
			type: INDEX_TYPE.GSI,
		},
	},
})
export class User {
	@Attribute()
	id!: string;

	@Attribute({
		unique: true,
	})
	email!: string;

	@Attribute()
	emailVerified!: boolean | null;

	@Attribute()
	image!: string;

	@Attribute()
	name!: string;

	@Attribute()
	type!: "USER";
}