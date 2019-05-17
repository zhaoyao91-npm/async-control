const tap = require("tap");

const retry = require("../lib/wrappers/retry");

function passAt(n) {
  let count = 0;
  return function() {
    if (count < n) {
      throw new Error(`Failed at ${count++}`);
    } else {
      count++;
    }
  };
}

tap.test("retry passed", async () => {
  const fn = retry({ maxRetries: 2 })(passAt(2));
  await fn();
});

tap.test("retry failed", async t => {
  const fn = retry({ maxRetries: 2 })(passAt(3));
  t.rejects(fn, {
    message: "Max retries hit",
    errors: [
      { message: "Failed at 0" },
      { message: "Failed at 1" },
      { message: "Failed at 2" }
    ]
  });
});

tap.test("retry with customized backoff", async t => {
  const fn = retry({
    maxRetries: 2,
    backoff: () => {
      let count = 1;
      return () => count++ * 100;
    }
  })(passAt(2));

  const start = Date.now();
  await fn();
  const end = Date.now();

  const elapsed = end - start;
  console.log({ elapsed });
  t.assert(elapsed >= 300 && elapsed <= 330);
});
