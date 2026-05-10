"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { joinRoom } from "@/app/lib/room-api";
import "./OnboardingScreen.css";

export const OnboardingScreen = () => {
  const [username, setUsername] = useState("");
  const [joining, setJoining] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const joinMode = Boolean(roomId);

  useEffect(() => {
    const storedName = window.localStorage.getItem("username");

    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handlePrimaryAction = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    window.localStorage.setItem("username", username.trim());

    if (!joinMode || !roomId) {
      router.push("/game-session");
      return;
    }

    try {
      setJoining(true);
      setRoomError(null);
      await joinRoom(roomId, username.trim());
      window.localStorage.setItem("activeRoomId", roomId);
      router.push(`/game-session?room=${roomId}`);
    } catch (error) {
      setRoomError(
        error instanceof Error ? error.message : "Unable to join room",
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="onboarding-shell">
      <div className="hero-copy">
        <p className="eyebrow">GuessTheWordGame</p>
        <h1>{joinMode ? "Join your private lobby" : "Start a new game"}</h1>
        <p>
          {joinMode
            ? "You were invited to a room. Enter your username and join the lobby."
            : "Create a room, invite your friends, and launch the session when everyone is ready."}
        </p>
      </div>

      <div className="onboarding-card">
        <label htmlFor="userNameId" className="field-label">
          Username
        </label>
        <input
          type="text"
          className="textFieldStyling"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="userNameId"
          placeholder="Enter your username"
        />

        <div className="button-row">
          <button
            type="button"
            className="buttonStyling primary"
            onClick={handlePrimaryAction}
            disabled={joining}
          >
            {joinMode ? (joining ? "Joining..." : "Join") : "Press Play"}
          </button>

          {!joinMode && (
            <button
              type="button"
              className="buttonStyling secondary"
              onClick={() => router.push("/private")}
            >
              Private Room
            </button>
          )}
        </div>

        {roomId && (
          <p className="room-note">Room code: {roomId.toUpperCase()}</p>
        )}

        {roomError && <p className="error-message">{roomError}</p>}
      </div>
    </div>
  );
};
