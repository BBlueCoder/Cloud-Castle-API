const CustomError = require("./custom-error-class");

class FileNotFound extends CustomError {
  constructor() {
    super("File not found", 404);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = FileNotFound;
