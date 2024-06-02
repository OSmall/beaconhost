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
export default class Session {
	@Attribute()
	sessionToken!: string;

	@Attribute()
	userId!: string;

	@Attribute()
	expires!: number;

	@Attribute({
		hidden: true,
	})
	type!: "SESSION";
}