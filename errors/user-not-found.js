const CustomError = require('./custom-error-class');

class UserNotFound extends CustomError {
    constructor() {
        super('User not found, please enter a valid username', 404);
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserNotFound;
