"use client"

import styles from "./CreatePrivateRoomScreen.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreatePrivateRoomScreen = () => {
  const router = useRouter();
  const [numOfPlayers, setNumOfPlayers] = useState(2);
  const [rounds, setRounds] = useState(1);
  const [inviteLink, setInviteLink] = useState("");
  const [buttonText, setButtonText] = useState("Invite Link");
  const [showStartButton, setShowStartButton] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleGenerateInvite = async () => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 10);
    const link = `${window.location.origin}/game-session?room=${id}`;

    setRoomId(id);
    setInviteLink(link);
    setShowStartButton(true);

    try {
      await navigator.clipboard.writeText(link);
      setButtonText("Copied!");
    } catch (error) {
      console.error("Failed to copy invite link", error);
      setButtonText("Copy failed");
    }

    window.setTimeout(() => {
      setButtonText("Invite Link");
    }, 2000);
  };

  const handleStartGame = () => {
    if (!roomId) {
      return;
    }
    router.push(`/game-session?room=${roomId}`);
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.innerContent}>
        <label htmlFor="playersQuantity" className={styles.stylingnumberfieldText}>
          No of Players:
        </label>
        <input
          type="number"
          id="playersQuantity"
          name="playersQuantity"
          className={styles.numberFieldStyling}
          min="2"
          max="10"
          value={numOfPlayers}
          onChange={(e) => setNumOfPlayers(Number.parseInt(e.target.value, 10) || 2)}
        />

        <label htmlFor="round" className={styles.noOfRoundstext}>
          Rounds:
        </label>
        <input
          type="number"
          id="round"
          name="round"
          className={styles.roundFieldStyling}
          min="1"
          max="10"
          value={rounds}
          onChange={(e) => setRounds(Number.parseInt(e.target.value, 10) || 1)}
        />

        <button
          type="button"
          className={styles.backGameButtonStyling}
          onClick={() => router.back()}
        >
          Back
        </button>

        <button
          type="button"
          className={styles.inviteButtonStyling}
          onClick={handleGenerateInvite}
        >
          {buttonText}
        </button>

        {showStartButton && (
          <button
            type="button"
            className={styles.startGameButtonStyling}
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}

        <div className={styles.inviteSummary}>
          <p>{inviteLink || "Press Invite Link to generate the room"}</p>
        </div>
      </div>
    </div>
  );
};

