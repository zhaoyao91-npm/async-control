const sleep = require("../sleep");
const RetryError = require("../retry_error");

/**
 * @param {number} maxRetries
 * @param {Backoff} [backoff = immediateBackoff]
 * @return {Wrapper}
 */
function retry({ maxRetries, backoff = immediateBackoff }) {
  const maxTries = maxRetries + 1;

  return function wrapFunc(func) {
    return async function wrappedFunc() {
      const backoffFn = backoff();
      const errors = [];
      let runCount = 0;

      while (runCount < maxTries) {
        runCount = runCount + 1;

        try {
          return await func();
        } catch (err) {
          errors.push(err);
        }

        await sleep(backoffFn());
      }

      throw new RetryError(errors);
    };
  };
}

module.exports = retry;

function immediateBackoff() {
  return () => 0;
}
