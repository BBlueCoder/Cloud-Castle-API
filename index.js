const fileRouter = require('./routes/files-routes');
const userRouter = require('./routes/users-routes');
const express = require('express');
const bodyParser = require('body-parser');
const CustomError = require('./errors/custom-error-class');
const winston = require('winston');
const errorHandler = require('./middlewares/error-handler');

winston.add(new winston.transports.File({ filename : 'logger.log'}));

const app = express();
app.use(bodyParser.json());

app.use('/api/files',fileRouter);
app.use('/api/users',userRouter);

app.use(errorHandler);

app.listen(3000);
console.log('Start listening at port 3000');