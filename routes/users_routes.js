const UserController = require('../controllers/users_controller');
const express = require('express');
const route = express.Router();

route.post('/signup',(req,resp)=>{
    const controller = new UserController(req,resp);
    controller.signup(req,resp);
})

route.post('/login',(req,resp)=>{
    const controller = new UserController(req,resp);
    controller.login()
})

module.exports = route;
