/**
 * @param {number} factor - milliseconds
 * @param {number} [base = 2]
 * @param {number} [min = 0] - milliseconds
 * @param {number} [max = Infinity] - milliseconds
 * @return {Backoff}
 */
function expoBackoff({ factor, base = 2, min = 0, max = Infinity }) {
  return function backoff() {
    let index = 0;
    return function backoffFn() {
      index++;
      const value = (Math.pow(base, index) - 1) * factor;
      return Math.min(Math.max(value, min), max);
    };
  };
}

module.exports = expoBackoff;
