/**
 * @param {number} count
 * @param {number} interval - milliseconds
 * @return {Wrapper}
 */
function limitRate({ count, interval }) {
  const signal = new RateLimitSignal({ count, interval });

  return function wrapFunc(func) {
    return async function wrappedFunc() {
      await signal.wait();
      return func();
    };
  };
}

module.exports = limitRate;

class RateLimitSignal {
  constructor({ interval, count }) {
    this._interval = interval;
    this._count = count;
    this._queue = [];
  }

  _start() {
    if (!this._timer) {
      this._timer = setInterval(() => {
        if (this._queue.length === 0) this._stop();
        else this._pass();
      }, this._interval);
    }
  }

  _stop() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _pass() {
    const resolves = this._queue.splice(0, this._count);
    resolves.forEach(resolve => resolve());
  }

  wait() {
    return new Promise(resolve => {
      this._queue.push(resolve);
      this._start();
    });
  }
}
