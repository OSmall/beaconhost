"use client";

import { signOutAction } from "@/lib/actions";
import { User } from "next-auth";
import { createHash } from "crypto";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { SignOut } from "./auth";
import Link from "next/link";

export default function AvatarDropdown({ user }: { user: User }) {

	function generateGravatarUrl(email: string): string {
		let hash = createHash("sha256");
		hash.update(email.trim().toLowerCase());
		return `https://www.gravatar.com/avatar/${hash.digest('hex')}?size=512`;
	}

	return <DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="secondary" size="icon" className="rounded-full">
				<Avatar>
					<AvatarImage src={generateGravatarUrl(user.email ?? "")} alt={user.email ?? undefined} />
					<AvatarFallback>IMG</AvatarFallback>
				</Avatar>
				<span className="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent  align="end">
			<DropdownMenuGroup>
				<DropdownMenuLabel className="font-semibold">
					Signed in as {user.email}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					My Settings
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuGroup aria-label="sign out section">
				<form action={signOutAction}>
					<DropdownMenuItem>
						<button className="flex h-full w-full" type="submit">
							Sign Out
						</button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
}