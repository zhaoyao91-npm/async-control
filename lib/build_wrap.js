const buildRun = require("./build_run");

/**
 * @typedef Wrap
 * @param {function(...args): any} func
 * @return {function(...args): Promise<any>} wrappedFunc
 */

/**
 * @param {...Wrapper | Wrapper[]} wrappers
 * @return {Wrap}
 */
function buildWrap(...wrappers) {
  const run = buildRun(...wrappers);
  return function wrap(func) {
    return function wrappedFunc(...args) {
      return run(() => func(...args)).then(results => results[0]);
    };
  };
}

module.exports = buildWrap;
