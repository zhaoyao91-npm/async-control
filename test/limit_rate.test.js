const tap = require("tap");

const sleep = require("../lib/sleep");
const buildRun = require("../lib/build_run");
const limitRate = require("../lib/wrappers/limit_rate");

tap.test("run functions with rate limit", async t => {
  const run = buildRun(limitRate({ count: 2, interval: 10 }));

  const results = [];

  function gen(x) {
    return function() {
      results.push(x);
    };
  }

  run([1, 2, 3, 4, 5].map(gen));

  t.strictSame(results, []);

  await sleep(10);

  t.strictSame(results, [1, 2]);

  await sleep(10);

  t.strictSame(results, [1, 2, 3, 4]);

  await sleep(10);

  t.strictSame(results, [1, 2, 3, 4, 5]);
});
