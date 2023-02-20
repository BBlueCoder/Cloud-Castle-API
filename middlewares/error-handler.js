const CustomError = require('../errors/custom-error-class');

module.exports = (err,req,resp,next)=>{
    if(err instanceof CustomError){
        resp.status(err.statusCode).json({"Message":err.message});
        return;
    }
    resp.status(500).json({"Message":""+err});
}