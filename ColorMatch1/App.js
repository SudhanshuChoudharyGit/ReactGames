import React, { useState, useEffect } from 'react';
import './ColorMatcher.css';
import correctSound from './sounds/correct.mp3';
import wrongSound from './sounds/wrong.mp3';
import startSound from './sounds/start.mp3';
import endSound from './sounds/end.mp3';
import restartSound from './sounds/restart.mp3';
import avatar1 from './avatars/avatar1.png';
import avatar2 from './avatars/avatar2.png';
import avatar3 from './avatars/avatar3.png';
import avatar4 from './avatars/avatar4.png';

const avatars = [avatar1, avatar2, avatar3, avatar4];
const colorOptions = ['red', 'blue', 'green', 'yellow'];

const App = () => {
  const [targetColor, setTargetColor] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(12);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (storedLeaderboard) {
      setLeaderboard(storedLeaderboard);
    }
  }, []);

  useEffect(() => {
    if (gameOver) {
      const newScore = { name: selectedName, avatar: selectedAvatar, score };
      const newLeaderboard = [...leaderboard, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
      setLeaderboard(newLeaderboard);
      localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameStarted && time > 0) {
      const timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (time === 0 && !gameOver) {
      setGameOver(true);
      new Audio(endSound).play();
    }
  }, [gameStarted, time, gameOver]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTime(12);
    setGameStarted(true);
    setGameOver(false);
    setTargetColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    new Audio(startSound).play();
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setTime(12);
    setGameStarted(true);
    setGameOver(false);
    setTargetColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    new Audio(restartSound).play();
  };

  const handleSquareClick = (color) => {
    if (color === targetColor) {
      setScore(score + 1);
      setTargetColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
      new Audio(correctSound).play();
    } else {
      setLives(lives - 1);
      new Audio(wrongSound).play();
    }
  };

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  return (
    <div className={`container ${gameOver ? 'game-over' : ''}`}>
      {!gameStarted ? (
        <div className="avatar-selection">
          <h2>Select your avatar and enter your name</h2>
          <div className="avatar-container">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => handleAvatarClick(avatar)}
              />
            ))}
          </div>
          <input type="text" value={selectedName} onChange={handleNameChange} placeholder="Enter your name" />
          <button className="button" onClick={startGame} disabled={!selectedName || !selectedAvatar}>
            Start
          </button>
        </div>
      ) : (
        <>
          <div className="score-container">
            <h2>Score: {score}</h2>
            <p>Lives: {lives}</p>
            <p>Time: {time}</p>
          </div>
          <div className="player-info">
            <img src={selectedAvatar} alt={`Avatar of ${selectedName}`} className="player-avatar" />
            <span className="player-name">{selectedName}</span>
          </div>
          <div className="target-color" style={{ backgroundColor: targetColor }}></div>
          <div className="square-container">
            {colorOptions.map((color, index) => (
              <div
                key={index}
                className={`square ${lives === 1 ? 'shake' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleSquareClick(color)}
              ></div>
            ))}
          </div>
          <div className="leaderboard">
            <h2>Leaderboard</h2>
            <ul>
              {leaderboard.map((score, index) => (
                <li key={index}>
                  <img src={score.avatar} alt={`Avatar of ${score.name}`} />
                  <span>{score.name}</span>
                  <span>{score.score}</span>
                </li>
              ))}
            </ul>
          </div>
          {gameOver && (
            <div className="game-over-screen">
              <div className="game-over">
                <h2>Game Over</h2>
                <p>Your score: {score}</p>
                <button className="button" onClick={restartGame}>
                  Restart
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
