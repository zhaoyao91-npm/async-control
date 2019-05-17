/**
 * @param {number} time - milliseconds
 * @return {Backoff}
 */
function constBackoff(time) {
  return function backoff() {
    return function backoffFn() {
      return time;
    };
  };
}

module.exports = constBackoff;
