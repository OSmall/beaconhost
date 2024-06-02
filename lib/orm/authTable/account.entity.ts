import { Attribute, Entity, INDEX_TYPE } from "@typedorm/common";

@Entity({
	name: 'account', // name of the entity that will be added to each item as an attribute
	primaryKey: {
		partitionKey: 'USER#{{userId}}',
		sortKey: 'ACCOUNT#{{provider}}#{{providerAccountId}}',
	},
	indexes: {
		GSI1: {
			partitionKey: 'ACCOUNT#{{provider}}',
			sortKey: 'ACCOUNT#{{providerAccountId}}',
			type: INDEX_TYPE.GSI,
		},
	},
})
export default class Account {
	@Attribute()
	id!: string;

	@Attribute()
	userId!: string;
	
	@Attribute()
	provider!: string;

	@Attribute()
	providerAccountId!: string;

	@Attribute()
	scope!: string;

	@Attribute()
	token_type!: string;

	@Attribute()
	access_token!: string;

	@Attribute()
	type!: string;
}