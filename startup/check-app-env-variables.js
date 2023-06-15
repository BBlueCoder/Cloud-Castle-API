const config = require("config");

module.exports = () => {
  config.get("jwtPrivateKey");
  config.get("dbConfig.dbUser");
  config.get("dbConfig.dbName");
  config.get("dbConfig.dbPassword");
};
