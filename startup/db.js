const config = require("config");
const mongoose = require("mongoose");
const logger = require("../logger");

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
