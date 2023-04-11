import React, { useState, useEffect, useCallback, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

import TimerDisplay from "./timerDisplay";

/**
 * @param {} props
 * @returns {React.ReactNode}
 */
function App(props) {
  /** @type {[DOMHighResTimeStamp?, React.SetStateAction<DOMHighResTimeStamp?>]} */
  const [timerStart, setTimerStart] = useState(undefined);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(1500);
  /** @type {["work" | "break", React.SetStateAction<"work" | "break">]} */
  const [type, setType] = useState("work");

  // const updateAnimationFrame = useRef(undefined);

  const worker = useMemo(() => {
    let worker = new Worker("timer.js");
    worker.postMessage({ val: performance.timeOrigin }); // post time origin
    return worker;
  }, []);

  worker.onmessage = (e) => {
    let elapsedTime = e.data;
    // console.log(elapsedTime);
    if (elapsedTime !== elapsed) {
      if (elapsedTime >= duration) timerFinish();
      else setElapsed(elapsedTime);
    }
  };

  const bell = useMemo(() => new Audio("bell.mp3"), []);

  const isPlaying = useCallback(() => {
    return timerStart !== undefined;
  }, [timerStart]);

  const play = () => {
    setTimerStart(performance.now());
  };

  const pause = () => {
    setTimerStart(undefined);
    setDuration(duration - elapsed);
    setElapsed(0);
  };

  const restart = () => {
    setDuration(type === "work" ? 1500 : 300);
    if (isPlaying()) setTimerStart(performance.now());
  };

  const timerFinish = useCallback(() => {
    const notifyFinish = () => {
      new Notification("Timer done", {
        body: type === "work" ? "It's time to take a break!" : "It's time to get back to work!",
        requireInteraction: true,
      });
    };

    setTimerStart(undefined);
    setElapsed(0);
    setDuration(type === "work" ? 300 : 1500);
    setType(type === "work" ? "break" : "work");

    if (!("Notification" in window)) {
      alert("Timer done!");
    } else if (Notification.permission === "granted") {
      notifyFinish();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          notifyFinish();
        }
      });
    }
    bell.play();
  }, [type, bell]);

  useEffect(() => {
    worker.postMessage(timerStart);
  }, [timerStart, worker]);

  return (
    <div className={"timer-app" + (type === "break" ? " break" : "")}>
      <div className="timer-content">
        <TimerDisplay time={duration - elapsed} />
        <div className="timer-controls">
          <div className="timer-button" onClick={isPlaying() ? pause : play}>
            <FontAwesomeIcon icon={isPlaying() ? faPause : faPlay} />
          </div>
          <div className="timer-button" onClick={restart}>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
