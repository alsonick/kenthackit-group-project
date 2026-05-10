"use client"

import styles from "./CreatePrivateRoomScreen.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const CreatePrivateRoomScreen = () => {
  const router = useRouter();
  const [timer, setTimer] = useState({t: 30}); 
  const [numOfPlayers, setNumOfPlayers] = useState(2);
  const [buttonText, setButtonText] = useState("Invite Link");
  const [rounds, setRounds] = useState(1);
  const [showStartButton, setShowStartButton] = useState(false);


  "use client";
  //   const interval = setInterval(() => {
  //     setTimer(p => {
  import { useEffect, useMemo, useState } from "react";
  //         clearInterval(interval);
  import { createRoom, startRoom } from "@/app/lib/room-api";
  import { useRoomPolling } from "@/app/lib/useRoomPolling";
  //         return p;
  //       }
  //       return {
    const [hostName, setHostName] = useState("");
  //       }
  //   }, 1000);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState("");
    const [copyLabel, setCopyLabel] = useState("Generate invite link");
    const [actionError, setActionError] = useState<string | null>(null);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [isStartingGame, setIsStartingGame] = useState(false);
  // useEffect(() => {
    const { room, loading, refresh } = useRoomPolling(roomId);

    useEffect(() => {
      const storedName = window.localStorage.getItem("username");

      if (storedName) {
        setHostName(storedName);
      }
    }, []);

      const [numOfPlayers, setNumOfPlayers] = useState(2);
      const [rounds, setRounds] = useState(1);
      const [roomId, setRoomId] = useState<string | null>(null);
      const [inviteLink, setInviteLink] = useState("");
      const [copyLabel, setCopyLabel] = useState("Generate invite link");
      const [actionError, setActionError] = useState<string | null>(null);
      const [isCreatingRoom, setIsCreatingRoom] = useState(false);
      const [isStartingGame, setIsStartingGame] = useState(false);
      const { room, loading, refresh } = useRoomPolling(roomId);
      if (!roomId) {
        return;
      }

      void refresh();
    }, [refresh, roomId]);

    const playerCount = room?.playerCount ?? 0;
    const players = useMemo(() => room?.players ?? [], [room?.players]);

    const handleCreateInvite = async () => {
      if (!hostName.trim()) {
        setActionError("Enter a username on the main page first.");
        return;
      }

      try {
        setIsCreatingRoom(true);
        setActionError(null);
        const response = await createRoom({
          hostName: hostName.trim(),
          rounds,
          maxPlayers: numOfPlayers,
        });

        const createdRoom = response.room;
        const nextInviteLink = `${window.location.origin}/?room=${createdRoom.id}`;

        setRoomId(createdRoom.id);
        setInviteLink(nextInviteLink);
        setCopyLabel("Invite ready");
        window.localStorage.setItem("activeRoomId", createdRoom.id);
        window.localStorage.setItem("username", hostName.trim());
        await navigator.clipboard.writeText(nextInviteLink);
        setCopyLabel("Link copied");
        await refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Unable to create room",
        );
      } finally {
        setIsCreatingRoom(false);
      }
    };

    const handleStartGame = async () => {
      if (!roomId) {
        setActionError("Create an invite link before starting the game.");
        return;
      }

      try {
        setIsStartingGame(true);
        setActionError(null);
        await startRoom(roomId);
        router.push(`/game-session?room=${roomId}`);
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Unable to start the game",
        );
      } finally {
        setIsStartingGame(false);
      }
    };
        setShowStartButton(true);
        
      <div className="private-room-shell">
        <section className="room-panel room-panel--controls">
          <p className="eyebrow">Private lobby</p>
          <h1>Create the room</h1>
          <p className="room-description">
            Generate an invite link, wait for players to join, and start the game
            when the lobby is ready.
          </p>

          <div className="settings-grid">
            <label htmlFor="playersQuantity" className="field-label">
              Max players
            </label>
            <input
              type="number"
              id="playersQuantity"
              name="playersQuantity"
              className="numberFieldStyling"
              min="2"
              max="10"
              value={numOfPlayers}
              onChange={(event) => {
                setNumOfPlayers(Number.parseInt(event.target.value, 10) || 2);
              }}
            />

            <label htmlFor="round" className="field-label">
              Rounds
            </label>
            <input
              type="number"
              id="round"
              name="round"
              className="roundFieldStyling"
              min="1"
              max="10"
              value={rounds}
              onChange={(event) => {
                setRounds(Number.parseInt(event.target.value, 10) || 1);
              }}
            />
          </div>

          <div className="action-row">
            <button
              type="button"
              className="secondary-action"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={handleCreateInvite}
              disabled={isCreatingRoom}
            >
              {isCreatingRoom ? "Creating..." : copyLabel}
            </button>
          </div>

          <div className="invite-summary">
            <h2>Invite link</h2>
            <p>
              {inviteLink
                ? inviteLink
                : "Create the invite link before anyone can join."}
            </p>
          </div>

          <button
            type="button"
            className="startGameButtonStyling"
            disabled={!roomId || isStartingGame}
            onClick={handleStartGame}
          >
            {isStartingGame ? "Starting..." : "Start Game"}
          </button>

          {actionError && <p className="error-message">{actionError}</p>}
        </section>

        <aside className="room-panel room-panel--leaderboard">
          <div className="leaderboard-header">
            <div>
              <p className="eyebrow">Lobby leaderboard</p>
              <h2>Joined players</h2>
            </div>
            <div className="count-pill">
              {playerCount}/{numOfPlayers}
            </div>
          </div>

          <div className="leaderboard-list">
            {loading && <p className="empty-state">Loading lobby...</p>}

            {!loading && players.length === 0 && (
              <p className="empty-state">No one has joined yet.</p>
            )}

            {players.map((player, index) => (
              <article key={`${player.username}-${index}`} className="player-row">
                <span className="player-rank">#{index + 1}</span>
                <div className="player-meta">
                  <strong>{player.username}</strong>
                  <span>{player.role === "host" ? "Host" : "Player"}</span>
                </div>
                <span className="player-score">{player.score}</span>
              </article>
            ))}
          </div>
        </aside>
