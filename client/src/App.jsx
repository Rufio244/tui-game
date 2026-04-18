import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function App() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dealer, setDealer] = useState(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    socket.emit("join", "P1");

    socket.on("deal", (data) => {
      const myId = socket.id;
      setCards(data.cards[myId] || []);
      setDealer(data.dealer);
      setSelected([]);
      setResult("");
    });

    socket.on("result", (data) => {
      const myId = socket.id;
      setResult(data.results[myId] || "dealer");
    });

  }, []);

  const toggle = (card, i) => {
    if (selected.includes(i)) {
      setSelected(selected.filter(x => x !== i));
    } else if (selected.length < 2) {
      setSelected([...selected, i]);
    }
  };

  const confirm = () => {
    const main = selected.map(i => cards[i]);
    socket.emit("select", { main });
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h1>🃏 Tui Card Game</h1>

      <button onClick={() => socket.emit("start")}>
        🎲 Start Round
      </button>

      <h2>Cards</h2>

      <div style={{ display: "flex", gap: 10 }}>
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => toggle(c, i)}
            style={{
              padding: 20,
              background: selected.includes(i) ? "gold" : "white",
              color: "black",
              cursor: "pointer"
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <button onClick={confirm} disabled={selected.length !== 2}>
        ✅ Confirm Hand
      </button>

      <h2>Result: {result}</h2>
    </div>
  );
}
