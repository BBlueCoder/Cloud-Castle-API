const CustomError = require("./custom-error-class");

class FileDoesntHaveThumbnail extends CustomError{
    constructor(message){
        super(message,400);
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = FileDoesntHaveThumbnail;