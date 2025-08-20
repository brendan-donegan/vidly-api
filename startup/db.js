const config = require("config");
const mongoose = require("mongoose");
const logger = require("../logger");

module.exports = function () {
  mongoose
    .connect(config.get("db"))
    .then(() => logger.info("Connection established to MongoDB..."));
};
