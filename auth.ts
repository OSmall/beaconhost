import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { Config } from "sst/node/config"

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	providers: [
		GitHub({
			clientId: Config.GITHUB_ID,
			clientSecret: Config.GITHUB_SECRET,
		}),
	],
	trustHost: true,
	secret: Config.AUTH_SECRET,
});