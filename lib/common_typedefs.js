/**
 * @typedef {function(): Promise<*>} NoArgAsyncFunc
 */

/**
 * @typedef {function(NoArgAsyncFunc): NoArgAsyncFunc} Wrapper
 */

/**
 * @typedef {function(): function(): number} Backoff
 */
