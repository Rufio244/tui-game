import { useState } from "react";
import axios from "axios";

function App() {
  const [round, setRound] = useState(null);
  const [cards, setCards] = useState({});

  const startGame = async () => {
    const res = await axios.post("http://localhost:3000/game/start");
    setRound(res.data);
  };

  const deal = async () => {
    const res = await axios.post("http://localhost:3000/game/deal", {
      roundId: round.roundId
    });
    setCards(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎮 TUI GAME</h1>

      <button onClick={startGame}>Start Game</button>
      <button onClick={deal}>Deal Cards</button>

      <div style={{ marginTop: 20 }}>
        {Object.keys(cards).map(seat => (
          <div key={seat}>
            <h3>Seat {seat}</h3>
            {cards[seat].map((c, i) => (
              <button key={i}>{c}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
