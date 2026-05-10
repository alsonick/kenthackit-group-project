import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

type RoomStatus = "lobby" | "started";
type RoomRole = "host" | "player";

type RoomPlayer = {
  username: string;
  role: RoomRole;
  joinedAt: number;
  score: number;
  socketId?: string;
};

type RoomRecord = {
  id: string;
  rounds: number;
  maxPlayers: number;
  status: RoomStatus;
  createdAt: number;
  startedAt?: number;
  players: RoomPlayer[];
};

type RoomState = {
  id: string;
  rounds: number;
  maxPlayers: number;
  status: RoomStatus;
  createdAt: number;
  startedAt?: number;
  playerCount: number;
  players: Array<{
    username: string;
    role: RoomRole;
    joinedAt: number;
    score: number;
  }>;
};

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const rooms = new Map<string, RoomRecord>();

const normalizeUsername = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const toPositiveInteger = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toRoomState = (room: RoomRecord): RoomState => ({
  id: room.id,
  rounds: room.rounds,
  maxPlayers: room.maxPlayers,
  status: room.status,
  createdAt: room.createdAt,
  startedAt: room.startedAt,
  playerCount: room.players.length,
  players: [...room.players]
    .sort((left, right) => left.joinedAt - right.joinedAt)
    .map(({ username, role, joinedAt, score }) => ({
      username,
      role,
      joinedAt,
      score,
    })),
});

const generateRoomId = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const findRoom = (roomId: string) => rooms.get(roomId);

const upsertPlayer = (
  room: RoomRecord,
  username: string,
  role: RoomRole,
  socketId?: string,
) => {
  const existingPlayer = room.players.find(
    (player) => player.username.toLowerCase() === username.toLowerCase(),
  );

  if (existingPlayer) {
    existingPlayer.socketId = socketId;
    existingPlayer.role = existingPlayer.role === "host" ? "host" : role;
    return existingPlayer;
  }

  const player: RoomPlayer = {
    username,
    role,
    joinedAt: Date.now(),
    score: 0,
    socketId,
  };

  room.players.push(player);
  return player;
};

const emitRoomUpdate = (room: RoomRecord) => {
  io.to(room.id).emit("room:update", toRoomState(room));
};

const createRoomRecord = (rounds: number, maxPlayers: number) => {
  let roomId = generateRoomId();

  while (rooms.has(roomId)) {
    roomId = generateRoomId();
  }

  const room: RoomRecord = {
    id: roomId,
    rounds,
    maxPlayers,
    status: "lobby",
    createdAt: Date.now(),
    players: [],
  };

  rooms.set(roomId, room);
  return room;
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/rooms/:roomId", (req, res) => {
  const room = findRoom(req.params.roomId);

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  res.json({ room: toRoomState(room) });
});

app.post("/rooms", (req, res) => {
  const hostName = normalizeUsername(req.body?.hostName);

  if (!hostName) {
    res.status(400).json({ message: "Host username is required" });
    return;
  }

  const rounds = toPositiveInteger(req.body?.rounds, 1);
  const maxPlayers = toPositiveInteger(req.body?.maxPlayers, 2);
  const room = createRoomRecord(rounds, maxPlayers);

  upsertPlayer(room, hostName, "host");

  res.status(201).json({ room: toRoomState(room) });
});

app.post("/rooms/:roomId/join", (req, res) => {
  const room = findRoom(req.params.roomId);

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  const username = normalizeUsername(req.body?.username);

  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  const existingPlayer = room.players.find(
    (player) => player.username.toLowerCase() === username.toLowerCase(),
  );

  if (!existingPlayer && room.players.length >= room.maxPlayers) {
    res.status(409).json({ message: "Room is full" });
    return;
  }

  upsertPlayer(room, username, existingPlayer?.role ?? "player");
  emitRoomUpdate(room);

  res.json({ room: toRoomState(room) });
});

app.post("/rooms/:roomId/start", (req, res) => {
  const room = findRoom(req.params.roomId);

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  room.status = "started";
  room.startedAt = Date.now();
  emitRoomUpdate(room);

  res.json({ room: toRoomState(room) });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("message", (data: unknown) => {
    console.log("Received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT ?? 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
        1. a user can create a game session and share the link with friends
        2. friends can join the game session using the link
        3. once all players have joined, the host can start the game
        4. players take turns drawing and guessing the word
          -. when a user is drawing, their canvas updates in real-time for all other players
        5. there should be a timer for each turn, and a score system based on how quickly players guess the word
        6. at the end of the game, display a leaderboard with player scores
        7. implement a chat feature for players to communicate during the game
        8. ensure the game is responsive and works well on both desktop and mobile devices
        9. implement error handling for edge cases (e.g., player disconnects, invalid game session links, etc.)
        10. consider adding fun features like different drawing tools, color options, and sound effects to enhance the gaming experience
*/
