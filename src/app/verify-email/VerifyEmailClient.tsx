'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailClient() {
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage('No token provided');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/verifyEmail?token=${token}`);
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setMessage('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {loading ? (
        <p className="text-gray-500">Verifying your email...</p>
      ) : (
        <p className="text-lg">{message}</p>
      )}
    </div>
  );
}
