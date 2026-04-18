import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const deck = ['A','A','2','2','3','3','4','4','5','5','6','6','7','7','8','8','K','K'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function val(c) {
  if (c === 'K') return 0;
  if (c === 'A') return 1;
  return parseInt(c);
}

function point(a, b) {
  return (val(a) + val(b)) % 10;
}

function isPair(a, b) {
  return a === b;
}

function compare(p, d) {
  const pPair = isPair(...p.main);
  const dPair = isPair(...d.main);

  if (pPair && !dPair) return "win";
  if (!pPair && dPair) return "lose";

  const pPoint = point(...p.main);
  const dPoint = point(...d.main);

  if (pPoint > dPoint) return "win";
  if (pPoint < dPoint) return "lose";

  const pSide = point(...p.side);
  const dSide = point(...d.side);

  if (pSide > dSide) return "win";
  if (pSide < dSide) return "lose";

  return "draw";
}

let state = {
  players: {},
  cards: {},
  dealer: null,
  selections: {}
};

io.on("connection", (socket) => {

  socket.on("join", (seat) => {
    state.players[socket.id] = { seat };
  });

  socket.on("start", () => {
    const s = shuffle(deck);
    let i = 0;

    Object.keys(state.players).forEach(id => {
      state.cards[id] = s.slice(i, i+4);
      i += 4;
    });

    const ids = Object.keys(state.players);
    state.dealer = ids[Math.floor(Math.random()*ids.length)];
    state.selections = {};

    io.emit("deal", { cards: state.cards, dealer: state.dealer });
  });

  socket.on("select", ({ main }) => {
    const cards = state.cards[socket.id];
    const side = cards.filter(c => !main.includes(c) || main.splice(main.indexOf(c),1));

    state.selections[socket.id] = {
      main,
      side
    };

    // รอครบทุกคน
    if (Object.keys(state.selections).length === Object.keys(state.players).length) {
      const dealerSel = state.selections[state.dealer];

      let results = {};

      Object.keys(state.selections).forEach(id => {
        if (id === state.dealer) return;
        results[id] = compare(state.selections[id], dealerSel);
      });

      io.emit("result", { results, dealer: state.dealer });
    }
  });

  socket.on("disconnect", () => {
    delete state.players[socket.id];
  });
});

server.listen(3000, () => console.log("Server 3000"));
