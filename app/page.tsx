import { testORM } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import React from 'react';
import { authConnection } from '@/lib/orm/authTable/auth.table';
import User from '@/lib/orm/authTable/user.entity';

export default async function Page() {

  let user: User | undefined = undefined;
  try {
    user = await authConnection.entityManager.findOne(User, { id: "6ffc5dd2-2717-4e18-80f2-00a0ae0f742d" });
  } catch (e: unknown) {
    console.log("TypeDORM issue:", e);
  }

  return (
    <div className="flex gap-4 items-center">
      <Button size="sm">
        Small
      </Button>
      <Button size="default" color='primary' variant='outline'>
        Medium
      </Button>
      <Button size="lg">
        Large
      </Button>
      <br />

      <form action={testORM}>
        <Button type='submit'>Test ORM</Button>
      </form>

      {JSON.stringify(user)}

    </div>
  );
}