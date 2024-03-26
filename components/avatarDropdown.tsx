"use client";

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import { signOutAction } from "@/lib/actions";
import { User } from "next-auth";
import { createHash } from "crypto";

export default function AvatarDropdown({ user }: { user: User }) {

	function generateGravatarUrl(email: string): string {
		let hash = createHash("sha256");
		hash.update(email.trim().toLowerCase());
		return `https://www.gravatar.com/avatar/${hash.digest('hex')}?size=512`;
	}

	return <Dropdown showArrow>
		<DropdownTrigger>
			<Avatar
				src={generateGravatarUrl(user.email ?? "")}
				as='button'
			/>
		</DropdownTrigger>
		<DropdownMenu onAction={(key) => key === 'signout' && signOutAction()}>
			<DropdownSection showDivider title={user.email ?? undefined}>
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user.email}</p>
				</DropdownItem>
				<DropdownItem key="settings">
					My Settings
				</DropdownItem>
			</DropdownSection>
			<DropdownSection aria-label="sign out section">
				<DropdownItem key="signout" color="danger">
					Sign Out
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	</Dropdown>
}