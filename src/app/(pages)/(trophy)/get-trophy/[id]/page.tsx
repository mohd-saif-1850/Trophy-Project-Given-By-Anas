import { Suspense } from "react";
import TrophyDetailPage from "@/components/GetTrophy";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrophyDetailPage />
    </Suspense>
  );
}
