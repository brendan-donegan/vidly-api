const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
