import { Suspense } from "react";
import ChangePasswordClient from "@/components/ChangePasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordClient />
    </Suspense>
  );
}
