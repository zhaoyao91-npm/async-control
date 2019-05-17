/**
 * @param {number} step - milliseconds
 * @param {number} [min = 0] - milliseconds
 * @param {number} [max = Infinity] - milliseconds
 * @return {Backoff}
 */
function linearBackoff({ step, min = 0, max = Infinity }) {
  return function backoff() {
    let index = 0;
    return function backoffFn() {
      index++;
      const value = step * index;
      return Math.min(Math.max(value, min), max);
    };
  };
}

module.exports = linearBackoff;
