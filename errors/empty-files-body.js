const CustomError = require("./custom-error-class");

class EmptyBody extends CustomError {
  constructor(message) {
    super(message, 400);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = EmptyBody;
