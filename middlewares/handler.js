module.exports = function(handler){
    return async (req,resp,next)=>{
        try{
            await handler(req,resp);
        }catch(ex){
            next(ex);
        }
    }
}