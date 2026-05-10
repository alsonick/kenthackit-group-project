import { Suspense } from "react";
import { GameSession } from "@/app/screens/GameSession/GameSession";
import { Layout } from "@/app/components/Layout/Layout";

export default function GameSessionPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading drawing board...</div>}>
        <GameSession />
      </Suspense>
    </Layout>
  );
}
