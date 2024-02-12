import { auth } from '@/lib/auth';
import { SignIn, SignOut } from '@/components/auth';
import { Button } from '@nextui-org/button';
import React from 'react';

export default async function Page() {

  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex gap-4 items-center">
      <Button size="sm" isLoading>
        Small
      </Button>
      <Button size="md" color='primary' variant='shadow'>
        Medium
      </Button>
      <Button size="lg">
        Large
      </Button>
      <br />

      {user ? <SignOut>Welcome {JSON.stringify(user)}!</SignOut> : <SignIn>You are not signed in</SignIn>}
    </div>
  );
}