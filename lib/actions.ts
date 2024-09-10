"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { Account, Session, User } from "./orm/authTable";

export async function signInAction() {
	await signIn();
}

export async function signOutAction() {
	await signOut();
}

export async function testORM() {
	const user = (await auth())?.user;
	let query;
	query = await Session.query
		.byUser({
			userId: user?.id || "",
			// sessionToken: "8afef681-605a-430a-a754-7a4c52332e61"
		})
		.go({ ignoreOwnership: true });

	console.log(query);

	query = await User.query
		// .byId({ id: user?.id || "" })
		.byEmail({ email: user?.email || "" })
		.go({ ignoreOwnership: true });

	console.log(query);

	query = await Account.query
		.byUser({
			userId: user?.id || "",
			provider: "github",
		})
		// .byProvider({ provider: "github", providerAccountId: "20054845" })
		.go({ ignoreOwnership: true });

	console.log(query);
}