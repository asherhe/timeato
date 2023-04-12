import React, { useState, useEffect, useCallback, useMemo } from "react";

import TimerDisplay from "./timer-display";
import TimerControls from "./timer-controls";
import TypeControls from "./type-controls";

import TimerWorker from "../timer-worker";
import buildWorker from "../worker-builder";

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
  const [timerType, setTimerType] = useState("work");

  const worker = useMemo(() => {
    let worker = buildWorker(TimerWorker);
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
    setDuration(timerType === "work" ? 1500 : 300);
    if (isPlaying()) setTimerStart(performance.now());
  };

  const timerFinish = useCallback(() => {
    const notifyFinish = () => {
      new Notification("Timer done", {
        body: timerType === "work" ? "It's time to take a break!" : "It's time to get back to work!",
        requireInteraction: true,
      });
    };

    setTimerStart(undefined);
    setElapsed(0);
    setDuration(timerType === "work" ? 300 : 1500);
    setTimerType(timerType === "work" ? "break" : "work");

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
  }, [timerType, bell]);

  useEffect(() => {
    worker.postMessage(timerStart);
  }, [timerStart, worker]);

  let playing = isPlaying();
  return (
    <div className={"timer-app" + (timerType === "break" ? " break" : "")}>
      <div className="timer-content">
        <TimerDisplay time={duration - elapsed} />
        <TimerControls mode={playing ? "pause" : "play"} onplay={playing ? pause : play} onrestart={restart} />
        <TypeControls
          type={timerType}
          setType={(type) => {
            setDuration(type === "work" ? 1500 : 300);
            setTimerStart(undefined);
            setTimerType(type);
          }}
          active={!playing}
        />
      </div>
    </div>
  );
}

export default App;
