const User = require("../db/users-crud");

module.exports = function (req, resp, next) {
  const user = new User(req.body.username, req.body.password);
  try {
    user.validateUser();
    next();
  } catch (ex) {
    resp.status(ex.statusCode).json({ Message: ex.message });
  }
};
