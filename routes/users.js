const auth = require("../middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validate } = require("../models/user");

router.post("/", async (req, res, body) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered");
  }
  const { n, e, p } = req.body;
  user = new User({
    n,
    e,
    p,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ name: user.name, email: user.email });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  if (!user) {
    return res.status(500).send("Something went wrong, unable to find user");
  }
  res.send(user);
});

module.exports = router;
