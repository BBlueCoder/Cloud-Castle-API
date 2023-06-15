const UserController = require('../controllers/users-controller');
const handler = require('../middlewares/handler');
const validateUserRequest = require('../middlewares/validate-user-request');

const express = require('express');
const route = express.Router();

route.post(
    '/signup',
    validateUserRequest,
    handler(async (req, resp) => {
        const controller = new UserController(req, resp);
        await controller.signup(req, resp);
    })
);

route.post(
    '/login',
    validateUserRequest,
    handler(async (req, resp) => {
        const controller = new UserController(req, resp);
        await controller.login();
    })
);

module.exports = route;
