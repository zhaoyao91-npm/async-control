# Async Control

Help control parallel executions of async tasks/functions.

## Install

```bash
npm i @bucuo/async-control
```

## Usage

### Wrappers

Wrappers are composable high order functions which provide various async control options.

```js
const {
  returnError,
  retry,
  limitRate,
  limitParallel,
  expoBackoff
} = require("@bucuo/async-control");

const wrappers = [
  returnError(), // returning error instead of throwing
  retry({
    maxRetries: 3,
    backoff: expoBackoff({
      factor: 1000, // milliseconds
      base: 3, // defaults to 2
      min: 100, // milliseconds, defaults to 0
      max: 1000 // milliseconds, defaults to Infinity
    })
    // backoff: constBackoff(...)
    // backoff: linearBackoff(...)
  }),
  limitRate({
    count: 100,
    interval: 1000 // milliseconds
  }),
  limitParallel(500)
];
```

### Run

You can build a `run` function to run many tasks (async functions without arg) with controls.

```js
const { buildRun } = require("@bucuo/async-control");

const wrappers = ...

const tasks = ... // async function without arg

const run = buildRun(wrappers);
// const run = buildRun(...wrappers); // another api format

const results = await run(tasks);
// const results = await run(...tasks); // another api format
```

### Wrap

You can wrap an existing async function to get a controlled version of it.

```js
const { buildWrap } = require("@bucuo/async-control");

const wrappers = ...

const wrap = buildWrap(wrappers);
// const wrap = buildWrap(...wrappers);

const myFetch = wrap(fetch);

const response = await fetch("https://github.com/bucuo-js");
```

## API

Function Builders:

- [buildRun](./lib/build_run.js)
- [buildWrap](./lib/build_wrap.js)

Wrappers:

- [returnError](./lib/wrappers/return_error.js)
- [retry](./lib/wrappers/retry.js)
- [limitRate](./lib/wrappers/limit_rate.js)
- [limitParallel](./lib/wrappers/limit_parallel.js)

Retry Backoffs:

- [constBackoff](./lib/backoffs/const_backoff.js)
- [linearBackoff](./lib/backoffs/linear_backoff.js)
- [expoBackoff](./lib/backoffs/expo_backoff.js)

Errors:

- [RetryError](./lib/retry_error.js)

## Note

### Note about `buildWrap`

If you use the same `wrap` functions to wrap multiple target functions, the wrapped functions will share the same suite
of wrappers (so the invocations of them would be controlled in the same limit queue, etc).

This logic is correct and intended, but should be put emphasis on to avoid misunderstandings.

If you need the wrapped function to be controlled separately, make sure build separate a suit of wrappers for each of them.

## License

MIT
