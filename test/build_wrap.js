const tap = require("tap");

const buildWrap = require("../lib/build_wrap");

tap.test("simple build wrap", async t => {
  function doubleResult(func) {
    return function() {
      return func().then(x => x + x);
    };
  }

  function hi(name) {
    return "hi " + name;
  }

  const doubleHi = buildWrap(doubleResult)(hi);

  t.equal(await doubleHi("Bob"), "hi Bobhi Bob");
});
