const logger = require("../logger");

function error(err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("An unexpected error occured");
}

module.exports = error;
