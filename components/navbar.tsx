import { auth } from "@/lib/auth";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import AvatarDropdown from "./avatarDropdown";
import { SignIn } from "./auth";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <NextUINavbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {
          user ?
            <AvatarDropdown user={user} />
            :
            <NavbarItem className="hidden lg:flex">
              <SignIn />
            </NavbarItem>
        }
      </NavbarContent>
    </NextUINavbar>
  )
}