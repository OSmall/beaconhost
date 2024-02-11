import { signIn, signOut } from "@/lib/auth";
import { Button } from "@nextui-org/react";

export function SignIn({ children }: { children?: React.ReactNode }): React.ReactNode {
  return (
    <div>
      <form action={async () => {
        "use server";
        await signIn();
      }}>
        <Button type='submit'>Sign In</Button>
      </form>
      {children}
    </div>
  )
}

export function SignOut({ children }: { children?: React.ReactNode }): React.ReactNode {
  return (
    <div>
      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <Button type='submit'>Sign Out</Button>
      </form>
      {children}
    </div>
  )
}