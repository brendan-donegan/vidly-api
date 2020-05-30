const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

router.post("/", async (req, res, body) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered");
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
  res.send(user);
});

module.exports = router;
