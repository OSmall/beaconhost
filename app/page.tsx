import { auth, signIn, signOut } from '@/auth';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Button } from '@nextui-org/button';
import React from 'react';
import { Table } from 'sst/node/table';


function SignIn({ children }: { children?: React.ReactNode }): React.ReactNode {
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

function SignOut({ children }: { children?: React.ReactNode }): React.ReactNode {
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

export default async function Page() {

  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const get = new GetCommand({
    TableName: Table.user.tableName,
    Key: {
      id: "1",
    },
  });
  const results = await db.send(get);
  const email = results.Item?.email;

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
      <h1>{email}</h1>
      <br />

      {user ? <SignOut>Welcome {JSON.stringify(user)}!</SignOut> : <SignIn>You are not signed in</SignIn>}
    </div>
  );
}