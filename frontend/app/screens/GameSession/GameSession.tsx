"use client";

import { DrawingCanvas } from "@/app/components/DrawingCanvas/DrawingCanvas";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoomPolling } from "@/app/lib/useRoomPolling";
import "./GameSession.css";

export const GameSession = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRoomId = searchParams.get("room");
  const [storedRoomId, setStoredRoomId] = useState<string | null>(null);

  useEffect(() => {
    setStoredRoomId(window.localStorage.getItem("activeRoomId"));
  }, []);

  const roomId = searchRoomId ?? storedRoomId;
  const { room, loading, error } = useRoomPolling(roomId);
  const players = useMemo(() => room?.players ?? [], [room?.players]);
  const playerCount = room?.playerCount ?? 0;

  if (!roomId && !loading) {
    return (
      <div className="game-session-container empty-session">
        <div className="empty-session-card">
          <p className="eyebrow">Game session</p>
          <h1>No room selected</h1>
          <p>Join or create a room before opening the game session.</p>
          <button type="button" onClick={() => router.push("/")}>
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-session-container">
      <header className="session-header">
        <div>
          <p className="eyebrow">Game session</p>
          <h1>{room?.status === "started" ? "Live match" : "Lobby ready"}</h1>
          <p className="session-summary">
            Room {room?.id ?? roomId?.toUpperCase()} • {room?.rounds ?? "?"}{" "}
            rounds
          </p>
        </div>
        <div className="session-stats">
          <div className="stat-card">
            <span className="stat-label">Joined</span>
            <strong>{playerCount}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Max</span>
            <strong>{room?.maxPlayers ?? "?"}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Status</span>
            <strong>{room?.status ?? "loading"}</strong>
          </div>
        </div>
      </header>

      <div className="game-main-area">
        <DrawingCanvas />
        <div className="leader-board-container">
          <div className="leaderboard-topline">
            <h2>Leaderboard</h2>
            <span>{playerCount} joined</span>
          </div>

          {loading && <p className="empty-state">Loading room...</p>}
          {error && <p className="empty-state error-state">{error}</p>}

          {!loading && !error && players.length === 0 && (
            <p className="empty-state">Waiting for players to join.</p>
          )}

          {players.map((player, index) => (
            <div
              key={`${player.username}-${index}`}
              className={`player-info-card rank-${index + 1}`}
            >
              <span className="player-rank">#{index + 1}</span>
              <span className="player-name">{player.username}</span>
              <span className="player-score">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="players-section-container">
        <h2>Connected Players ({playerCount})</h2>
        <div className="players-list">
          {players.map((player, index) => (
            <div key={`${player.username}-${index}`} className="player-card">
              <span>{player.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
