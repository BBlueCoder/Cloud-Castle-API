const { createLogger, transports } = require('winston');

module.exports = function(){
    createLogger({
        transports:[
            new transports.File({filename: './log/uncaught-exceptions.log',handleExceptions:true,handleRejections:true})
        ]
    })
}
