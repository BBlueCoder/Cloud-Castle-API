const { createLogger, format,transports } = require('winston');

module.exports = function(){
    const logger = createLogger({
        format: format.json(),
        transports:[
            new transports.File({filename: './log/logger.log'})
        ]
    })

    return logger;
}