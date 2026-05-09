"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import "./OnboardingScreen.css";

export const OnboardingScreen = () => {
  const [username, setUsername] = useState("");

  const router = useRouter();

  return (
    <div className="layout-container">
      <h1 className="title">GuessTheWordGame</h1>
      <div className="container">
        <button
          type="button"
          className="buttonStyling"
          id="playButtonPosition"
          onClick={() => {
            if (username === "") {
              alert("Please enter a username");
            } else {
              router.push("/game-session");
            }
          }}
        >
          Press Play
        </button>
        <button
          type="button"
          className="buttonStyling"
          onClick={() => {
            return router.push("/private");
          }}
        >
          Private Room
        </button>
        <input
          type="text"
          className="textFieldStyling"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="userNameId"
          placeholder="Enter your Username"
        ></input>
      </div>
    </div>
  );
};
