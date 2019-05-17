const tap = require("tap");

const expoBackoff = require("../lib/backoffs/expo_backoff");

tap.test("simple expo backoff", async t => {
  const fn = expoBackoff({ factor: 1 })();

  const results = [fn(), fn(), fn()];

  t.strictSame(results, [1, 3, 7]);
});

tap.test("expo backoff with factor, base, min and max", async t => {
  const fn = expoBackoff({
    factor: 2,
    base: 3,
    min: 10,
    max: 100
  })();

  const results = [fn(), fn(), fn(), fn()];

  t.strictSame(results, [
    10, // (3-1)*2=4
    16, // (9-1)*2=16,
    52, // (27-1)*2=52
    100 // (81-1)*2=160
  ]);
});
