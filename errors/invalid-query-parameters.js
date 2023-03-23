const CustomError = require("./custom-error-class");

class InvalidQueryParameters extends CustomError{
    constructor(){
        super("Invalid query parameters, limit and offset should be numbers and sort_order either asc or desc",400);
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidQueryParameters;