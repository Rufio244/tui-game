import express from "express";
import http from "http";
import { Server } from "socket.io";
import { deck, shuffle } from "./deck.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let gameState = {
  players: {},
  dealerSeat: null,
  cards: {}
};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", (seat) => {
    gameState.players[socket.id] = { seat };
  });

  socket.on("startRound", () => {
    const shuffled = shuffle(deck);

    let i = 0;
    Object.keys(gameState.players).forEach((id) => {
      gameState.cards[id] = shuffled.slice(i, i + 4);
      i += 4;
    });

    // สุ่มเจ้ามือ
    const ids = Object.keys(gameState.players);
    gameState.dealerSeat = ids[Math.floor(Math.random() * ids.length)];

    io.emit("deal", gameState);
  });

  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
  });
});

server.listen(3000, () => console.log("Server running"));
