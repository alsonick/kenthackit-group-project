"use client";

import { OnboardingScreen } from "./screens/OnboardingScreen/OnboardingScreen";
import { Layout } from "./components/Layout/Layout";

export default function Home() {
  return (
    <Layout>
      <OnboardingScreen />
    </Layout>
  );
}
