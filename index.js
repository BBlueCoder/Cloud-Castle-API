const fileRouter = require('./routes/files_routes');
const userRouter = require('./routes/users_routes');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use('/api/files',fileRouter);
app.use('/api/users',userRouter);

app.use((err,req,resp,next)=>{
    console.log(err.statusCode());
    if(err.statusCode()){
        resp.status(err.statusCode()).json({"Message":err.message});
        return;
    }
    resp.status(500).json({"Error":""+err});
})

app.listen(3000);
console.log('Start listening at port 3000');