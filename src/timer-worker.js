const TimerWorker = () => {
  var timerStart = undefined,
    timeOffset = undefined;

  setInterval(() => {
    if (timerStart !== undefined) {
      postMessage(Math.floor((performance.now() - timerStart + timeOffset) * 0.001));
    }
  }, 100);

  onmessage = (e) => {
    if (typeof e.data === "object") timeOffset = performance.timeOrigin - e.data[0]; // performance time offset
    else timerStart = e.data; // new timer start
  };
};

export default TimerWorker;
