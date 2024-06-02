"use server";

import { signIn, signOut } from "@/lib/auth";
import { authConnection } from '@/lib/orm/authTable/auth.table';
import User from '@/lib/orm/authTable/user.entity';
import Account from '@/lib/orm/authTable/account.entity';

export async function signInAction() {
	await signIn();
}

export async function signOutAction() {
	await signOut();
}

export async function testORM() {
	const user = await authConnection.entityManager.findOne(User, { id: "6d7b595a-c24a-47b8-84c9-c4e60a60ad3c" })
	console.log(user);
	console.log(user instanceof User);

	const users = (await authConnection.entityManager.find(Account, { provider: 'github' }, { queryIndex: "GSI1" })).items
	console.log(users);
	console.log(users[0] instanceof Account);
}