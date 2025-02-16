import { testORM } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import React from 'react';
import { AuthEntities } from '@/lib/auth';

export default async function Page() {

  const query = await AuthEntities.user.scan.go();

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

      {JSON.stringify(query, null, 2)}

    </div>
  );
}