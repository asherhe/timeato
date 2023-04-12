import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

/**
 * @param {{mode: "play" | "pause", onplay: () => void, onrestart: () => void}} props
 * @returns
 */
function TimerControls({ mode, onplay, onrestart }) {
  return (
    <div className="timer-controls">
      <div className="timer-button" onClick={onplay}>
        <FontAwesomeIcon icon={mode === "play" ? faPlay : faPause} />
      </div>
      <div className="timer-button" onClick={onrestart}>
        <FontAwesomeIcon icon={faArrowRotateLeft} />
      </div>
    </div>
  );
}

export default TimerControls;
