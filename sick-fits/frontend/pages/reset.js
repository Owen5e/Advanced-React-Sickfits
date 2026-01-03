import React from 'react';
import { useRouter } from 'next/router';
import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage() {
  const router = useRouter();
  const { token } = router.query;
  if (!token) {
    return (
      <div>
        <p>No token provided</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <p>Reset your password {token}</p>
      <Reset token={token} />
    </div>
  );
}
