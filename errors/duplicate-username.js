const CustomError = require("./custom-error-class");

class DuplicateUsername extends CustomError {
  constructor() {
    super("Username is duplicated, please change your username", 406);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DuplicateUsername;
