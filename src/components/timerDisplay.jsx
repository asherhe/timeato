import React from "react";

/**
 * @param {{time: number}} props
 * @returns {React.ReactNode}
 */
function TimerDisplay(props) {
  let time = `${Math.floor(props.time / 60)
    .toString()
    .padStart(2, "0")}:${(props.time % 60).toString().padStart(2, "0")}`;
  document.title = `${time} - timeato`;
  return <span className="timer-display">{time}</span>;
}

export default TimerDisplay;
