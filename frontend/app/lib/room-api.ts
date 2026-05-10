export type RoomStatus = "lobby" | "started";

export type RoomPlayer = {
  username: string;
  role: "host" | "player";
  joinedAt: number;
  score: number;
};

export type RoomState = {
  id: string;
  rounds: number;
  maxPlayers: number;
  status: RoomStatus;
  createdAt: number;
  startedAt?: number;
  playerCount: number;
  players: RoomPlayer[];
};

export const getBackendBaseUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

async function readJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message?: string }).message ?? "Request failed")
        : "Request failed";

    throw new Error(message);
  }

  return payload;
}

export async function createRoom(payload: {
  hostName: string;
  rounds: number;
  maxPlayers: number;
}) {
  const response = await fetch(`${getBackendBaseUrl()}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJsonResponse<{ room: RoomState }>(response);
}

export async function joinRoom(roomId: string, username: string) {
  const response = await fetch(`${getBackendBaseUrl()}/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  return readJsonResponse<{ room: RoomState }>(response);
}

export async function startRoom(roomId: string) {
  const response = await fetch(`${getBackendBaseUrl()}/rooms/${roomId}/start`, {
    method: "POST",
  });

  return readJsonResponse<{ room: RoomState }>(response);
}

export async function fetchRoom(roomId: string) {
  const response = await fetch(`${getBackendBaseUrl()}/rooms/${roomId}`, {
    cache: "no-store",
  });

  return readJsonResponse<{ room: RoomState }>(response);
}
