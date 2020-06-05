const express = require("express");
const app = express();
const logger = require("./logger");

process.on("uncaughtException", (ex) => {
  logger.error(ex.message);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  logger.error(ex.message);
  process.exit(1);
});

require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);
module.exports = server;
