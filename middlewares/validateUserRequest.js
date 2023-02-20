module.exports = function(req,resp,next){
    if(!req.body.username){
        resp.status(400).json({"Error":"Username field is requiered"});
        return;
    }

    if(!req.body.password){
        resp.status(400).json({"Error":"Password field is requiered"});
        return;
    }

    next();
}