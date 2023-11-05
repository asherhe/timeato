import React, { useState, useEffect, useCallback, useMemo } from "react";

import TimerDisplay from "./timer-display";
import TimerControls from "./timer-controls";
import TypeControls from "./type-controls";

import TimerWorker from "../timer-worker";
import buildWorker from "../worker-builder";

class TimerType {
  /**
   * @typedef {"work" | "break"} TypeStr
   * @param {TypeStr} state
   */
  constructor(state) {
    this.state = state;
    this.breakCount = 0;
  }

  duration() {
    switch (this.state) {
      case "work":
        return 1500;
      case "break":
        return this.breakCount % 4 === 3 ? 900 : 300;
      default:
        return -1;
    }
  }

  next() {
    switch (this.state) {
      case "work":
        this.state = "break";
        break;
      case "break":
        this.breakCount++;
        this.state = "work";
        break;
      default:
        break;
    }
    return this;
  }
}

/**
 * @param {} props
 * @returns {React.ReactNode}
 */
function App(props) {
  /** @type {[DOMHighResTimeStamp?, React.SetStateAction<DOMHighResTimeStamp?>]} */
  const [timerStart, setTimerStart] = useState(undefined);
  const [elapsed, setElapsed] = useState(0);
  const [timerType, setTimerType] = useState(new TimerType("work"));
  const [duration, setDuration] = useState(timerType.duration());

  const worker = useMemo(() => {
    let worker = buildWorker(TimerWorker);
    worker.postMessage([performance.timeOrigin]); // post time origin
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

  const bell = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/bell.mp3`), []);

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
    setDuration(timerType.duration());
    if (isPlaying()) setTimerStart(performance.now());
  };

  const timerFinish = useCallback(() => {
    const notifyFinish = () => {
      new Notification("Timer done", {
        body: timerType.state === "work" ? "It's time to get back to work!" : "It's time to take a break!",
      });
    };

    setTimerStart(undefined);
    setElapsed(0);
    setTimerType(timerType.next());
    setDuration(timerType.duration());

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
    <div className={"timer-app" + (timerType.state === "break" ? " break" : "")}>
      <div className="timer-content">
        <TimerDisplay time={duration - elapsed} />
        <TimerControls mode={playing ? "pause" : "play"} onplay={playing ? pause : play} onrestart={restart} />
        <TypeControls
          type={timerType.state}
          setType={(type) => {
            let newType = new TimerType(type);
            setTimerStart(undefined);
            setElapsed(0);
            setTimerType(newType);
            setDuration(newType.duration());
          }}
          active={!playing}
        />
      </div>
    </div>
  );
}

export default App;
