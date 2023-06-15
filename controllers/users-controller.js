const User = require('../db/users-crud');
const Controller = require('./controller');

class UserController extends Controller {
    constructor(req, resp) {
        super(req, resp);
        this.currentUser = new User(req.body.username, req.body.password);
    }

    async signup() {
        const token = await this.currentUser.signup();
        this.sendSuccessResponse({ token: token });
    }

    async login() {
        const token = await this.currentUser.login();
        this.sendSuccessResponse({ token: token });
    }
}

module.exports = UserController;
