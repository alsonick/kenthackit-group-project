"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRoom, RoomState } from "./room-api";

export const useRoomPolling = (roomId?: string | null) => {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [loading, setLoading] = useState(Boolean(roomId));
  const [error, setError] = useState<string | null>(null);

  const loadRoom = useCallback(async () => {
    if (!roomId) {
      setRoom(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetchRoom(roomId);
      setRoom(response.room);
    } catch (loadError) {
      setRoom(null);
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load room",
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void loadRoom();

    if (!roomId) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadRoom();
    }, 2000);

    return () => window.clearInterval(interval);
  }, [loadRoom, roomId]);

  return {
    room,
    loading,
    error,
    refresh: loadRoom,
  };
};
