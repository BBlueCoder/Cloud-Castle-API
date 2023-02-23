const fileRouter = require('./routes/files-routes');
const userRouter = require('./routes/users-routes');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error-handler');
require('./startup/create-exceptions-logger')();
const logger = require('./startup/create-console-logger')();
require('./startup/check-app-env-variables')();

const app = express();

app.use(bodyParser.json());
app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

app.listen(3000);
logger.info('Start listening at port 3000');