const Pool = require("pg").Pool;
const config = require("config");

const pool = new Pool({
  user: config.get("dbConfig.dbUser"),
  host: config.get("dbConfig.dbAdress"),
  database: config.get("dbConfig.dbName"),
  password: config.get("dbConfig.dbPassword"),
  port: config.get("dbConfig.dbPort"),
  idleTimeoutMillis: 1000,
});

module.exports = pool;
