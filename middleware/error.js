function error(err, req, res, next) {
  res.status(500).send("An unexpected error occured");
}

module.exports = error;
