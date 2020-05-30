const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
    },
    isGold: Boolean,
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
