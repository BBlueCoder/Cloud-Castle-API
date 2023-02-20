class UserNotFound extends Error{
    constructor(){
        super("User not found, please enter a valid username");
        Error.captureStackTrace(this, this.constructor);

        this.status = 404;
    }

    statusCode(){
        return this.status;
    }
}

module.exports = UserNotFound;