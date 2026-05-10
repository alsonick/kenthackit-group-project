"use client";

import { DrawingCanvas } from "@/app/components/DrawingCanvas/DrawingCanvas";
import { useEffect, useState } from "react";
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

  const sessionTitle = roomId
    ? room?.status === "started"
      ? "Live match"
      : "Lobby ready"
    : "Drawing board";

  const sessionSummary = roomId
    ? `Room ${room?.id ?? roomId?.toUpperCase()} • ${room?.rounds ?? "?"} rounds`
    : "A free drawing board is ready for you.";

  return (
    <div className="game-session-container">
      <header className="session-header">
        <div>
          <p className="eyebrow">Game session</p>
          <h1>{sessionTitle}</h1>
          <p className="session-summary">{sessionSummary}</p>
        </div>
        <button type="button" className="exit-button" onClick={() => router.push("/")}>
          Exit
        </button>
      </header>

      <div className="game-main-area">
        <DrawingCanvas />
      </div>

      {error && <p className="empty-state error-state">{error}</p>}
    </div>
  );
};
