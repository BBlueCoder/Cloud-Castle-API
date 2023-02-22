const jwt = require('jsonwebtoken');

module.exports = function(req,resp,next){
    const token = req.headers['authentication'];
    if(!token){
        resp.status(401).json({"Message":"No token was found, You must send an authentication header that contains a valid token"});
        return
    }

    jwt.verify(token,"privateKey",(err,decoded)=>{
        if(err){
            let msg = "token is invalid, You must login again to have a new valid token"
            if(err.message.includes("expired")){
                msg = "token expired, You must login again to have a new valid token";
            }

            resp.status(401).json({"Message":msg});
            return
        }
        req.userId = decoded.data.id;
        next();
    })
}