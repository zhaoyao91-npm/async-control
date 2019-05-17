const tap = require("tap");

const linearBackoff = require("../lib/backoffs/linear_backoff");

tap.test("simple linear backoff", async t => {
  const fn = linearBackoff({ step: 2 })();

  const results = [fn(), fn(), fn()];

  t.strictSame(results, [2, 4, 6]);
});

tap.test("linear backoff with step, min and max", async t => {
  const fn = linearBackoff({
    step: 3,
    min: 10,
    max: 20
  })();

  const results = Array(9)
    .fill(0)
    .map(fn);

  t.strictSame(results, [
    10, // 3
    10, // 6
    10, // 9
    12,
    15,
    18,
    20, // 21
    20, // 24
    20 // 27
  ]);
});
