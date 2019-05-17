/**
 * @typedef {function(): any} NoArgFunc
 */

/**
 * @typedef Run
 * @param {...NoArgFunc | NoArgFunc[]} funcs
 * @return {Promise<any[]>}
 */

/**
 * @param {...Wrapper | Wrapper[]} wrappers
 * @return {Run}
 */
function buildRun(...wrappers) {
  wrappers = parseArrayArgs(wrappers);
  const wrapper = compose(...wrappers);
  return function run(...funcs) {
    funcs = parseArrayArgs(funcs);
    return Promise.all(
      funcs
        // ensure func is async
        // so wrappers can safely assume that func returns a promise
        .map(func => async () => func())
        .map(wrapper)
        .map(func => func())
    );
  };
}

module.exports = buildRun;

function parseArrayArgs(args) {
  if (args.length === 1 && Array.isArray(args[0])) return args[0];
  else return args;
}

function compose(...funcs) {
  return function(arg) {
    return funcs.reduceRight((result, func) => func(result), arg);
  };
}
