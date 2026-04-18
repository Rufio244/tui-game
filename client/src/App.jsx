import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function App() {
  const [cards, setCards] = useState([]);
  const [dealer, setDealer] = useState(null);

  useEffect(() => {
    socket.emit("join", "P1");

    socket.on("deal", (data) => {
      const myId = socket.id;
      setCards(data.cards[myId] || []);
      setDealer(data.dealerSeat);
    });
  }, []);

  return (
    <div className="bg-black text-white p-5">
      <h1>Tui Card Game</h1>

      <button onClick={() => socket.emit("startRound")}>
        Start Round
      </button>

      <div className="mt-4">
        <h2>Your Cards</h2>
        <div className="flex gap-2">
          {cards.map((c, i) => (
            <div key={i} className="bg-white text-black p-4">
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
