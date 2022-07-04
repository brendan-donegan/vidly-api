const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validId = require("../middleware/validId");
const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const c = await Customer.find().sort("name");
  res.send(c);
});

router.get("/:id", validId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send(`Could not find customer with ID ${req.params.id}`);
  }
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Create the customer in the database
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  const created = await customer.save();
  res.status(201).send(created);
});

router.put("/:id", [auth, admin, validId], async (req, res) => {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send(`Could not find customer with ID ${req.params.id}`);
  }
  customer.name = req.body.name;
  customer.phone = req.body.phone;
  customer.isGold = req.body.isGold;
  const newCustomer = await customer.save();
  res.send(newCustomer);
});

router.delete("/:id", [auth, admin, validId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send(`Could not find customer with ID ${req.params.id}`);
  }
  res.send(customer);
});

module.exports = router;
