class InvalidPassword extends Error{
    constructor(){
        super("Password is incorrect");
        Error.captureStackTrace(this, this.constructor);

        this.status = 401;
    }

    statusCode(){
        return this.status;
    }
}

module.exports = InvalidPassword;