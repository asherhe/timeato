import React from "react";

/**
 * @param {{time: number}} props
 * @returns {React.ReactNode}
 */
function TimerDisplay({ time }) {
  let timeStr = `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
  document.title = `${timeStr} - timeato`;
  return <span className="timer-display">{timeStr}</span>;
}

export default TimerDisplay;
