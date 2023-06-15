const CustomError = require('../errors/custom-error-class');
const logger = require('../startup/create-logger')();

module.exports = (err, req, resp, next) => {
    if (err instanceof CustomError) {
        resp.status(err.statusCode).json({ Message: err.message });
        return;
    }
    logger.error(err.message, err);
    resp.status(500).json({ Message: 'Something went wrong, please try again' });
};
