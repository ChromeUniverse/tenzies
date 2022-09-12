import React from 'react'

function Die(props) {

  let dots = [];
  for (let i = 1; i <= props.value; i++) {
    dots.push(
      <div
        // had to add list key here cause React wouldn't shut up
        key={props.id + `die-dot-${i}`}
        className={`die-dot die-dot-${i}`}
      ></div>
    );
  }

  return (
    <div
      className={`
        die
        die-${props.value} 
        ${props.unclickable ? "die-grayed" : ""} 
        ${props.isHeld ? "die-green" : ""}
      `}
      onClick={() => props.hold(props.id)}
    >
      {dots}
    </div>
  );
}

export default Die