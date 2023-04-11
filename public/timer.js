var timerStart = undefined,
  timeOffset = undefined;

setInterval(() => {
  if (timerStart !== undefined) {
    let now = performance.now();
    console.log(`${now} - ${timerStart} = ${now - timerStart} = ${now - timerStart + timeOffset} ms`);
    postMessage(Math.floor((performance.now() - timerStart + timeOffset) * 0.001));
  }
}, 100);

onmessage = (e) => {
  if (typeof e.data === "object") timeOffset = performance.timeOrigin - e.data["val"]; // performance time offset
  else timerStart = e.data; // new timer start
};
