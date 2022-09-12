import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {

  const [gameState, setGameState] = useState(0);
  const [PBtime, setPBtime] = useState(Number(localStorage.getItem('pb')));
  const [time, setTime] = useState(0);
  const [dice, setDice] = useState(allNewDice());
  const [rolls, setRolls] = useState(0);

  // timer
  useEffect(() => {
    let interval = setInterval(() => {
      if (gameState === 1) setTime(oldTime => oldTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // endgame
  useEffect(() => {

    if (gameState !== 1) return;              // only run checks if game is running

    const firstValue = dice[0].value;
    for (const die of dice) {
      if (!die.isHeld) return;                // all dice must be held
      if (die.value !== firstValue) return;   // the value of all held dice must be the same
    }

    
    setGameState(2);                          // move to endgame state
    
    // record new personal best time
    setPBtime(oldPBtime => {
      const newPBtime = oldPBtime == 0 ? time : Math.min(oldPBtime, time)
      localStorage.setItem('pb', newPBtime.toString());
      return newPBtime;
    });
  }, dice)

  function generateNewDie() {
    return { id: nanoid(), value: Math.ceil(Math.random() * 6), isHeld: false }
  }

  function allNewDice() {
    let newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((oldDie) =>
        oldDie.isHeld ? oldDie : generateNewDie()
      )
    );
    setRolls(oldRolls => oldRolls + 1);
  }

  function hold(id) {
    if (gameState !== 1) return;
    setDice((oldDice) =>
      oldDice.map((oldDie) =>
        oldDie.id === id ? { ...oldDie, isHeld: !oldDie.isHeld } : oldDie
      )
    );
  }

  function clickHandler() {
    if (gameState === 0) {      
      setGameState(1);
    } else if (gameState === 1) {
      rollDice();
    } else if (gameState === 2) {
      setGameState(0);
      setDice(allNewDice());
      setRolls(0);
      setTime(0);
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      id={die.id}
      value={die.value}
      isHeld={die.isHeld}
      unclickable={gameState !== 1}
      hold={hold}
    />
  ));

  let btnText;
  if (gameState === 0) btnText = 'Start';
  else if (gameState === 1) btnText = 'Roll';
  else if (gameState === 2) btnText = 'New Game';

  return (
    <main className="main">
      {gameState === 2 && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="stats">
        <p className="stats-item stats-rolls">
          Rolls: <span className="stats-highlight">{rolls}</span>
        </p>
        <p className="stats-item stats-time">
          Time: <span className="stats-highlight">{time}s</span>
        </p>
        <p className="stats-item stats-pb">
          PB: <span className="stats-highlight">{PBtime}s</span>
        </p>
      </div>
      <div className="dice-container">{diceElements}</div>
      <button className="btn" onClick={clickHandler}>
        {btnText}
      </button>
    </main>
  );
}

export default App;
