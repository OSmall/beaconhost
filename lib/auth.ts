import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import env from "@/lib/env";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	providers: [
		GitHub({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
	],
	trustHost: true,
	secret: env.AUTH_SECRET,	
});