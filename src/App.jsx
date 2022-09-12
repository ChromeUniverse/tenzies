import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {

  const [tenzies, setTenzies] = useState(false);
  const [PBtime, setPBtime] = useState(Number(localStorage.getItem('pb')));
  const [time, setTime] = useState(0);
  const [dice, setDice] = useState(allNewDice());
  const [rolls, setRolls] = useState(0);

  // timer
  useEffect(() => {
    let interval = setInterval(() => {
      if (!tenzies) setTime(oldTime => oldTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tenzies]);

  // endgame
  useEffect(() => {
    let value = dice[0].value;
    for (const die of dice) {
      if (!die.isHeld) return;          // all dice must be held
      if (die.value !== value) return;  // the value of all held dice must be the same
    }
    setTenzies(true);    
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
    setDice((oldDice) =>
      oldDice.map((oldDie) =>
        oldDie.id === id ? { ...oldDie, isHeld: !oldDie.isHeld } : oldDie
      )
    );
  }

  function clickHandler() {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(false);
      setRolls(0);
      setTime(0);
    } else {
      rollDice();
    }
  }

  const diceElements = dice.map((die) => (
    <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} hold={hold} />
  ));

  return (
    <main className="main">
      {tenzies && <Confetti />}
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
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
