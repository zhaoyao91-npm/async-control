class RetryError extends Error {
  constructor(errors) {
    super("Max retries hit");
    this.errors = errors;
  }
}

module.exports = RetryError;
