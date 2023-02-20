class DuplicateUsername extends Error{
    constructor(){
        super("Username is duplicated, please change your username");
        Error.captureStackTrace(this, this.constructor);

        this.status = 406;
    }

    statusCode(){
        return this.status;
    }
}

module.exports = DuplicateUsername;