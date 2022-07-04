const logger = require("../logger");

function error(e, req, res, next) {
  logger.error(e.message);
  res.status(500).send("An unexpected error occured");
}

module.exports = error;
