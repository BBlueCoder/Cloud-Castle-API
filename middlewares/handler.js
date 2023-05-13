//Handle all the code inside the request,
//If en error happened during the request
//It calls next() function and pass the error to it
//The next function call the error-handler middleware since it is the last middleware

module.exports = function(handler){
    return async (req,resp,next)=>{
        try{
            await handler(req,resp);
        }catch(ex){
            next(ex);
        }
    }
}