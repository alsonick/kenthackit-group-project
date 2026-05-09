"use client";

import { useRouter } from "next/navigation";
import "./OnboardingScreen.css";

export const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <div className="layout-container">
      <h1 className="title">GuessTheWordGame</h1>
      <div className="container">
        <button
          type="button"
          className="buttonStyling"
          id="playButtonPosition"
          onClick={() => router.push("/game-session")}
        >
          Press Play
        </button>
        <button type="button" className="buttonStyling">
          Private Room
        </button>
        <input
          type="text"
          className="textFieldStyling"
          id="userNameId"
          placeholder="Enter your Username"
        ></input>
      </div>
    </div>
  );
};
