"use client";

import { useRouter } from "next/navigation";
import "./OnboardingScreen.css";

export const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <div className="onboarding-shell">
      <div className="hero-copy">
        <p className="eyebrow">Drawing Game</p>
        <h1>Drawing Game</h1>
        <p>Press Play to open the drawing board and start creating artwork.</p>
      </div>

      <div className="onboarding-card">
        <div className="button-row">
          <button
            type="button"
            className="buttonStyling primary"
            onClick={() => router.push("/game-session")}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
