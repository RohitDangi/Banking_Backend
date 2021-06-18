const config = require("config");
const db = config.get("db");

module.exports = db;