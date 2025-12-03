import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // restrict in prod
});

// Lightweight in-memory stores (use DB in prod)
const USERS = {}; // socketId -> { userId, name }
const ROOMS = {}; // roomId -> Set(socketId)

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // register user on connect (simple)
  socket.on("register", ({ userId, name }) => {
    USERS[socket.id] = { userId, name };
    socket.emit("registered", { socketId: socket.id });
  });

  // join a room (1:1 or group)
  socket.on("join-room", ({ roomId }) => {
    if (!ROOMS[roomId]) ROOMS[roomId] = new Set();
    ROOMS[roomId].add(socket.id);
    socket.join(roomId);
    // notify others
    socket.to(roomId).emit("peer-joined", { socketId: socket.id, name: USERS[socket.id]?.name || null });
  });

  // leave room
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    ROOMS[roomId]?.delete(socket.id);
    socket.to(roomId).emit("peer-left", { socketId: socket.id });
  });

  // text message relay
  socket.on("msg", ({ roomId, message, meta }) => {
    // meta: { fromUserId, toUserId, timestamp }
    io.to(roomId).emit("msg", { fromSocket: socket.id, message, meta });
  });

  // WebRTC signaling: offer/answer/candidate
  socket.on("webrtc-offer", ({ toSocketId, offer, roomId }) => {
    io.to(toSocketId).emit("webrtc-offer", { fromSocket: socket.id, offer, roomId });
  });
  socket.on("webrtc-answer", ({ toSocketId, answer, roomId }) => {
    io.to(toSocketId).emit("webrtc-answer", { fromSocket: socket.id, answer, roomId });
  });
  socket.on("webrtc-candidate", ({ toSocketId, candidate }) => {
    io.to(toSocketId).emit("webrtc-candidate", { fromSocket: socket.id, candidate });
  });

  // simple presence ping
  socket.on("ping", () => socket.emit("pong"));

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
    // cleanup
    delete USERS[socket.id];
    for (const [rid, set] of Object.entries(ROOMS)) {
      if (set.has(socket.id)) {
        set.delete(socket.id);
        socket.to(rid).emit("peer-left", { socketId: socket.id });
      }
    }
  });
});

app.get("/", (req, res) => res.json({ ok: true, msg: "LoveKitty signaling server" }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Signaling server running on http://localhost:${PORT}`));
