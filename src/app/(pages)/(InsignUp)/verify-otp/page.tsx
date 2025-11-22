import { Suspense } from "react";
import VerifyOtpPage from '@/components/VerifyOtp'

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
