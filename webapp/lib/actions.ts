"use server";

import { auth, AuthEntities, signIn, signOut } from "@/lib/auth";

export async function signInAction() {
	await signIn();
}

export async function signOutAction() {
	await signOut();
}

export async function testORM() {
	const user = (await auth())?.user;
	let query;
	query = await AuthEntities.session.query
		.byUser({
			userId: user?.id || "",
			// sessionToken: "8afef681-605a-430a-a754-7a4c52332e61"
		})
		.go();

	console.log(query);

	query = await AuthEntities.user.query
		// .byId({ id: user?.id || "" })
		.byEmail({ email: user?.email || "" })
		.go();

	console.log(query);

	query = await AuthEntities.account.query
		.byUser({
			userId: user?.id || "",
			provider: "github",
		})
		// .byProvider({ provider: "github", providerAccountId: "20054845" })
		.go();

	console.log(query);
}