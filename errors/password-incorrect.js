const CustomError = require("./custom-error-class");

class InvalidPassword extends CustomError{
    constructor(){
        super("Password is incorrect",401);
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidPassword;