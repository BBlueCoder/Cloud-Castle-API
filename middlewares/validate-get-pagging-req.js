const InvalidQueries = require("../errors/invalid-query-parameters");

module.exports = function (req, resp, next) {
  const { limit, offset, sort_order } = req.query;
  if (limit && offset) {
    if (isNaN(parseInt(limit)) || isNaN(parseInt(offset))) {
      throw new InvalidQueries();
    }
  }

  if (sort_order) {
    if (sort_order !== "asc" && sort_order !== "desc")
      throw new InvalidQueries();
  } else {
    req.query.sort_order = "desc";
  }

  next();
};
