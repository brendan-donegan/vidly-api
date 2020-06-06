const server = require("./server.js");
const logger = require("./logger");

const port = process.env.PORT || 3000;
server.listen(port, () => logger.info(`Listening on port ${port}...`));
