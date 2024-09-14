import { signInAction, signOutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function SignIn(): React.ReactNode {
  return (
    <div>
      <form action={signInAction}>
        <Button type='submit'>Sign In</Button>
      </form>
    </div>
  );
}

export function SignOut(): React.ReactNode {
  return (
    <div>
      <form action={signOutAction}>
        <Button type='submit'>Sign Out</Button>
      </form>
    </div>
  );
}