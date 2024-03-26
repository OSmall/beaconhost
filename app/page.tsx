import { Button } from '@nextui-org/button';
import React from 'react';

export default async function Page() {

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
    </div>
  );
}