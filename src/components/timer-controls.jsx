import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @param {{mode: "play" | "pause", onplay: () => void, onrestart: () => void}} props
 */
function TimerControls({ mode, onplay, onrestart }) {
  return (
    <div className="timer-controls">
      <div className="timer-btn" onClick={onplay}>
        <FontAwesomeIcon icon={mode === "play" ? faPlay : faPause} size="lg" />
      </div>
      <div className="timer-btn" onClick={onrestart}>
        <FontAwesomeIcon icon={faArrowRotateLeft} size="lg" />
      </div>
    </div>
  );
}

export default TimerControls;
