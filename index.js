const fileRouter = require('./routes/files-routes');
const userRouter = require('./routes/users-routes');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error-handler');

const logger = require('./startup/create-winston-logger')();

const app = express();
app.use(bodyParser.json());
app.use((req,resp,next)=>{
    req.logger = logger;
    next();
})

app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(3000);
logger.info('Start listening at port 3000');