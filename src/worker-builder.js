/**
 * creates a web worker from a function that initializes a worker
 * filename-independent so can be used with react
 * @param {() => any} worker
 * @returns {Worker}
 */
function buildWorker(worker) {
  let code = worker.toString();
  let blob = new Blob([`(${code})()`]); // blob representing a js function that runs the code
  return new Worker(URL.createObjectURL(blob));
}

export default buildWorker;
