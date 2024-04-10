/**
 * @param {{time: number}} props
 */
function TimerDisplay({ time }) {
  let secs = time % 60,
    mins = Math.floor(time / 60) % 60,
    hrs = Math.floor(time / 3600);
  secs = secs.toString().padStart(2, "0");
  mins = mins.toString().padStart(2, "0");
  hrs = hrs ? hrs.toString().padStart(2, "0") + ":" : "";
  let timeStr = `${hrs}${mins}:${secs}`;
  document.title = `${timeStr} - timeato`;
  return <span className="timer-display">{timeStr}</span>;
}

export default TimerDisplay;
