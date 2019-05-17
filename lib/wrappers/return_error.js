function returnError() {
  return function wrapFunc(func) {
    return async function wrappedFunc() {
      return func().catch(x => x);
    };
  };
}

module.exports = returnError;
