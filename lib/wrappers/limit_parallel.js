/**
 * @param {number} maxCount
 * @return {Wrapper}
 */
function limitParallel(maxCount) {
  const signal = new ParallelLimitSignal(maxCount);

  return function wrapFunc(func) {
    return async function wrappedFunc() {
      const done = await signal.wait();
      return func().finally(done);
    };
  };
}

module.exports = limitParallel;

class ParallelLimitSignal {
  constructor(maxCount) {
    this._maxCount = maxCount;
    this._queue = [];
    this._runningCount = 0;
  }

  _flush() {
    const countToRun = this._maxCount - this._runningCount;
    if (countToRun > 0) {
      const resolves = this._queue.splice(0, countToRun);
      this._runningCount += resolves.length;
      resolves.forEach(resolve => resolve());
    }
  }

  wait() {
    return new Promise(resolve => {
      this._queue.push(resolve);
      this._flush();
    }).then(() => () => {
      this._runningCount--;
      this._flush();
    });
  }
}
