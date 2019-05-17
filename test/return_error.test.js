const tap = require("tap");

const buildRun = require("../lib/build_run");
const returnError = require("../lib/wrappers/return_error");

const errorMsg = "Oops";

function throwError() {
  throw new Error(errorMsg);
}

tap.test("generally, run throws the error", async t => {
  const run = buildRun();
  t.rejects(run(throwError), { message: errorMsg });
});

tap.test("with [returnRun], run returns the error", async t => {
  const run = buildRun(returnError());
  const results = await run(throwError);
  t.match(results[0], { message: errorMsg });
});
