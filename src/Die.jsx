import React from 'react'

function Die(props) {

  const style = {
    backgroundColor: props.isHeld ? '#59E391' : '#FFFFFF'
  };


  let dots = [];
  for (let i = 1; i <= props.value; i++) {
    dots.push(<div className={`die-dot die-dot-${i}`}></div>)
  }

  return (
    <div
      className={`die die-${props.value}`}
      style={style}
      onClick={() => props.hold(props.id)}
    >
      {dots}
    </div>
  );
}

export default Die