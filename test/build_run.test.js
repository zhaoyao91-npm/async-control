const tap = require("tap");

const buildRun = require("../lib/build_run");

tap.test("run multiple async functions", async t => {
  const run = buildRun();

  const func1 = async () => {
    return "hello";
  };

  const func2 = async () => {
    return "world";
  };

  const results1 = await run(func1, func2);
  const results2 = await run([func1, func2]);

  const expectedResults = ["hello", "world"];

  t.strictSame(results1, expectedResults);
  t.strictSame(results2, expectedResults);
});

tap.test("run multiple async functions with some wrappers", async t => {
  function addPostfix(func) {
    return async function() {
      const result = await func();
      return result + "123";
    };
  }

  function reverseResult(func) {
    return async function() {
      const result = await func();
      return result
        .split("")
        .reverse()
        .join("");
    };
  }

  const run = buildRun([addPostfix, reverseResult]);

  const func1 = async () => {
    return "hello";
  };

  const func2 = async () => {
    return "world";
  };

  const results = await run(func1, func2);

  const expectedResults = ["olleh123", "dlrow123"];

  t.strictSame(results, expectedResults);
});
