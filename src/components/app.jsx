import React, { useState, useEffect, useCallback, useMemo } from "react";

import TimerDisplay from "./timer-display";
import TimerControls from "./timer-controls";
import TypeControls from "./type-controls";
import { TimerConfig, defaultConfig } from "./timer-config";

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

  /**
   *
   * @param {import("./timer-config").config} config
   * @returns {number} the duration of the timer's current state
   */
  duration(config) {
    switch (this.state) {
      case "work":
        return config.work;
      case "break":
        return (this.breakCount + 1) % config.longfreq === 0
          ? config.longbreak
          : config.break;
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
  /**
   * app config
   * @type {[import("./timer-config").config, React.SetStateAction<import("./timer-config").config>]}
   */
  const [config, setConfig] = useState(defaultConfig);

  /**
   * timestamp of when the timer was started
   * @type {[DOMHighResTimeStamp?, React.SetStateAction<DOMHighResTimeStamp?>]}
   */
  const [timerStart, setTimerStart] = useState(undefined);
  const [elapsed, setElapsed] = useState(0);
  const [timerType, setTimerType] = useState(new TimerType("work"));
  const [duration, setDuration] = useState(timerType.duration(config));

  const [paused, setPaused] = useState(false);

  // timer worker (runs in background)
  const worker = useMemo(() => {
    let worker = buildWorker(TimerWorker);
    worker.postMessage([performance.timeOrigin]); // post time origin
    return worker;
  }, []);

  // time update from worker
  worker.onmessage = (e) => {
    let elapsedTime = e.data;
    if (elapsedTime !== elapsed) {
      if (elapsedTime >= duration) timerFinish();
      else setElapsed(elapsedTime);
    }
  };

  // load the bell sound
  const bell = useMemo(
    () => new Audio(`${process.env.PUBLIC_URL}/bell.mp3`),
    []
  );

  const isPlaying = useCallback(() => {
    return timerStart !== undefined;
  }, [timerStart]);

  const play = () => {
    setTimerStart(performance.now());
    setPaused(false);
  };

  const pause = () => {
    setTimerStart(undefined);
    setDuration(duration - elapsed);
    setElapsed(0);
    setPaused(true);
  };

  const restart = () => {
    setDuration(timerType.duration(config));
    if (isPlaying()) setTimerStart(performance.now());
    setPaused(false);
  };

  const timerFinish = useCallback(() => {
    // make a new notification
    const notifyFinish = () => {
      new Notification("Timer done", {
        body:
          timerType.state === "work"
            ? "It's time to get back to work!"
            : "It's time to take a break!",
      });
    };

    // reset timer
    setTimerStart(undefined);
    setElapsed(0);
    setTimerType(timerType.next());
    setDuration(timerType.duration(config));

    // send notification
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

    if (config.autoStart) {
      play();
    }
  }, [timerType, bell, config]);

  // update time for woker
  useEffect(() => {
    worker.postMessage(timerStart);
  }, [timerStart, worker]);

  // update timer duration if config is updated and timer is not running
  useEffect(() => {
    if (!isPlaying() && !paused) setDuration(timerType.duration(config));
  }, [config, isPlaying, timerType, paused]);

  let playing = isPlaying();
  return (
    <div
      className={"timer-app" + (timerType.state === "break" ? " break" : "")}
    >
      <div className="timer-content">
        <TimerDisplay time={duration - elapsed} />
        <TimerControls
          mode={playing ? "pause" : "play"}
          onplay={playing ? pause : play}
          onrestart={restart}
        />
        <TypeControls
          type={timerType.state}
          setType={(type) => {
            let newType = new TimerType(type);
            setTimerStart(undefined);
            setElapsed(0);
            setTimerType(newType);
            setDuration(newType.duration(config));
          }}
          active={!playing}
        />
      </div>
      <TimerConfig config={config} setConfig={setConfig} />
    </div>
  );
}

export default App;
