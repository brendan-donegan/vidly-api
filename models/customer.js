const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    isGold: Boolean,
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(5).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
