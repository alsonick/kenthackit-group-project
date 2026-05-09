import { DrawingCanvas } from "@/app/components/DrawingCanvas/DrawingCanvas";
import "./GameSession.css";

export const GameSession = () => {
  const dummyData = [
    { name: "Player 1", score: 100 },
    { name: "Player 2", score: 80 },
    { name: "Player 3", score: 60 },
    { name: "Player 4", score: 40 },
    { name: "Player 5", score: 20 },
    { name: "Player 6", score: 10 },
    { name: "Player 7", score: 5 },
    { name: "Player 8", score: 2 },
    { name: "Player 9", score: 1 },
  ];
  return (
    <div className="game-session-container">
      <div className="game-main-area">
        <DrawingCanvas />
        <div className="leader-board-container">
          <h2>Leaderboard</h2>
          {dummyData.map((player, index) => (
            <div key={index} className={`player-info-card rank-${index + 1}`}>
              <span className="player-rank">#{index + 1}</span>
              <span className="player-name">{player.name}</span>
              <span className="player-score">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="players-section-container">
        <h2>Connected Players:</h2>
        <div className="players-list">
          {dummyData.map((player, index) => (
            <div key={index} className="player-card">
              <span>{player.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
