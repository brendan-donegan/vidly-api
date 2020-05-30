const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const prod = require("./startup/prod");
const express = require("express");
const app = express();
const config = require("config");
const mongoose = require("mongoose");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(`Could not connect to MongoDB ${err.message}`));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);

prod(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
