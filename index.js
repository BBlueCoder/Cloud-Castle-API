const fileRouter = require('./routes/files-routes');
const userRouter = require('./routes/users-routes');
const healthRouter = require('./routes/health-routes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error-handler');
require('./startup/create-exceptions-logger')();
const logger = require('./startup/create-console-logger')();
require('./startup/check-app-env-variables')();

const app = express();

app.use(
    cors({
        origin: '*',
    })
);
app.use(bodyParser.json());

app.use('/api/health', healthRouter);
app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);
app.use((req, resp, next) => {
    resp.status(404).json({ Message: 'Invalid Endpoint' });
});
app.use(errorHandler);

const server = app.listen(3000);
logger.info('Start listening at port 3000');

module.exports = server;
