const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

module.exports = function () {
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    const logger = createLogger({
        format: combine(label({ label: 'Console-Log' }), timestamp(), myFormat),
        transports: [new transports.Console({ handleExceptions: true })],
    });

    return logger;
};
