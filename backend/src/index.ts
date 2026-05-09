import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
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
