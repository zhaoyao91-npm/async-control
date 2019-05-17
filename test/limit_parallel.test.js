const tap = require("tap");

const sleep = require("../lib/sleep");
const buildRun = require("../lib/build_run");
const limitParallel = require("../lib/wrappers/limit_parallel");

tap.test("run functions with parallel limit", async t => {
  const run = buildRun(limitParallel(2));

  const results = [];

  function gen(x) {
    return async function() {
      await sleep(10);
      results.push(x);
    };
  }

  run([1, 2, 3, 4, 5].map(gen));

  t.strictSame(results, []);

  await sleep(5);

  t.strictSame(results, []);

  await sleep(10);

  t.strictSame(results, [1, 2]);

  await sleep(10);

  t.strictSame(results, [1, 2, 3, 4]);

  await sleep(10);

  t.strictSame(results, [1, 2, 3, 4, 5]);
});
