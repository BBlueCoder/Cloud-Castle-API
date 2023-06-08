const fileRouter = require('./routes/files-routes');
const userRouter = require('./routes/users-routes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error-handler');
require('./startup/create-exceptions-logger')();
const logger = require('./startup/create-console-logger')();
require('./startup/check-app-env-variables')();
const getHostIPv4 = require('./utils/get-host-ip');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

app.get('/api/health',(req,resp)=>{
    resp.send(`Server is healthy, host from ${getHostIPv4()}`);
})

app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

const server = app.listen(3000);
logger.info('Start listening at port 3000');

module.exports = server;