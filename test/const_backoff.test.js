const tap = require("tap");

const constBackoff = require("../lib/backoffs/const_backoff");

tap.test("simple const backoff", async t => {
  const fn = constBackoff(100)();

  const results = [fn(), fn(), fn()];

  t.strictSame(results, [100, 100, 100]);
});
