import { Suspense } from 'react';
import VerifyEmailPage from '@/app/verify-email/VerifyEmailPage/page';

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
